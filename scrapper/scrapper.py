#!/usr/bin/python3
# https://stackoverflow.com/questions/17380869/get-list-items-inside-div-tag-using-xpath

import requests
import time
import re
import datetime
import traceback
from pprint import pprint

from selenium import webdriver
from selenium.webdriver.firefox.options import Options

from lxml import html
import lxml.etree as et

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy import exc
from sqlalchemy.orm import sessionmaker

from db import dao
from db import model
from configs import ConfigurationLoader

import logging

# Create a custom logger
logger = logging.getLogger(__name__)


class Singleton(type):
    """Metaclass for singletons. Any instantiation of a Singleton class yields
    the exact same object, e.g.:

    >>> class MyClass(metaclass=Singleton):
            pass
    >>> a = MyClass()
    >>> b = MyClass()
    >>> a is b
    True
    """

    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

    @classmethod
    def __instancecheck__(mcs, instance):
        if instance.__class__ is mcs:
            return True
        else:
            return isinstance(instance.__class__, mcs)


class DbManager(metaclass=Singleton):
    engine = None
    _Session = None
    _ProductDAO = None
    _ProductPriceDAO = None

    def __init__(self):
        DbManager._engine = create_engine("postgresql://postgres:feedbuzz@localhost:5430/feedbuzz")
        DbManager._ProductDAO = dao.ProductDAO(DbManager._engine, self._get_config())
        DbManager._ProductPriceDAO = dao.ProductPriceDAO(DbManager._engine, self._get_config())
        DbManager._Session = sessionmaker(bind=self._engine)

    @classmethod
    def _get_config(cls):
        cls.configs = ConfigurationLoader().load_config()
        return cls.configs

    @classmethod
    def get_product_dao(cls) -> dao.ProductPriceDAO:
        return cls._ProductDAO

    @classmethod
    def get_product_price_dao(cls) -> dao.ProductPriceDAO:
        return cls._ProductPriceDAO

    @classmethod
    def create_session(cls):
        return cls._Session()


class Scrapper:
    def __init__(self):
        self._base_url = "https://www.sqdc.ca/"
        options = Options()
        options.headless = True
        self.browser = webdriver.Firefox(options=options)

    def close_browser(self):
        self.browser.quit()

    def close_age_validator(self):
        return None

    def get_product_path(self):
        products_path = []
        is_page_valid = True
        compteur = 1
        while is_page_valid:
            url = "{}en-CA/Search?keywords=*&sortDirection=asc&page={}".format(self._base_url, compteur)
            page = requests.get(url)
            tree = html.fromstring(page.content)
            path = tree.xpath('//a[@class="product-tile-media image-background"]/@href')
            # pprint(tree.xpath('//a[@class="product-tile-media image-background"]'))
            if len(path) == 0:
                is_page_valid = False
            else:
                products_path = products_path + path
                compteur = compteur + 1

        return products_path

    def process_product(self, path):
        """
        Get product identifier and verify if already in database

        """
        identifiant_match = re.search(r"/(\d*-P)", path)
        identifiant = identifiant_match.group(0)

        product_dao = DbManager().get_product_dao()

        session = DbManager().create_session()
        search_results = product_dao.find_by_identifiant(session, identifiant)

        if len(search_results) > 1:
            print("exeption, Product multiple time in DB")
            return False

        url = "{}{}".format(self._base_url, path, identifiant)
        pprint(url)

        # Prepare the html data
        self.browser.get(url)
        self.browser.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;"
        )
        time.sleep(0.5)

        if len(search_results) == 0:
            product = self._get_product_data(session, url, identifiant)
        else:
            product = search_results[0]

        # Check prices for each quantity
        self._get_product_price(session, product.id)
        session.close()

    def _get_product_data(self, session, url, identifiant):

        content = self.browser.page_source
        tree = html.fromstring(content)

        # Section thc and cbd
        cannab_data = tree.xpath(
            '//div[@class="product-details"]//section[@id="product-infos"]//div[@data-templateid="ProductInfosCannab"]//ul[@class="list-unstyled"]'
        )
        pprint(cannab_data)
        product = model.Product(identifiant=identifiant)
        # cannab = cannab_data[0].text_content()
        cannab = cannab_data[0].text_content().rstrip().lstrip().replace(",",".")
        cannab.splitlines()

        pprint(cannab)

        cannab_attributes_type = re.findall(r"(.*)", cannab)
        for attributes_type in cannab_attributes_type:
            pprint(attributes_type)
            if "THC" in attributes_type:
                thc_data = attributes_type
            elif "CBD" in attributes_type:
                cbd_data = attributes_type

        cannab_thc = re.findall(r"(\d+)", thc_data)
        if len(cannab_thc) == 1:
            product.thc_min = cannab_thc[0]
            product.thc_max = cannab_thc[0]
        else:
            product.thc_min = cannab_thc[0]
            product.thc_max = cannab_thc[1]

        cannab_cbd = re.findall(r"(\d+)", cbd_data)
        pprint(cannab_cbd)
        if len(cannab_cbd) == 1:
            product.cbd_min = cannab_cbd[0]
            product.cbd_max = cannab_cbd[0]
        else:
            product.cbd_min = cannab_cbd[0]
            product.cbd_max = cannab_cbd[1]

        # Section name
        product.name = tree.xpath('//h1[@property="name"]')[0].text_content()
        product.url = url
        product.image_url = tree.xpath('//div[@class="product-details-media"]//img[@class="img-fluid"]/@src')[0]
        product.identifiant = identifiant

        # TODO category type
        product_spec = tree.xpath('//div[@class="product-specifications  js-spec"]//p[@class="item"]')
        type_id = 0

        product = DbManager().get_product_dao().create_product(session, product)
        return product

    def _process_product_quantity(self, html_tree):
        return

    def _get_product_price(self, session, product_id):

        script = """
            document.getElementById("ageModal").remove();
            var lights = document.getElementsByClassName("modal-backdrop");
            while (lights.length)
            lights[0].classList.remove("modal-backdrop");
        """
        # time.sleep(1.5)
        self.browser.execute_script(script)


        content = self.browser.page_source
        tree = html.fromstring(content)

        # Get number of button which indicate the number of formats offert for this product
        qty_btns = tree.xpath('//div[@data-qa="product-variants"]//button')
        for index, btn in enumerate(qty_btns):

            button = self.browser.find_element_by_xpath(
                '//div[@data-qa="product-variants"]//button[{}]'.format(index + 1)
            )
            try: 
                time.sleep(0.5)
                button.click()
            except Exception as e:
                logging.exception("Error clicking on quantity button ... retrying")
                try:
                    time.sleep(1.5)
                    button.click()
                except Exception as e:
                    logging.exception("Error clicking on quantity button ... quitting")
                    return False



            content = self.browser.page_source
            tree = html.fromstring(content)

            # Get the quantity associate to this button
            product_quantity = qty_btns[index].text_content().rstrip().lstrip().split(" ")[0].replace(",", ".")

            # Get the price for this quantity
            price_element = tree.xpath('//div[@data-templateid="PriceDiscount"]//span[@property="price"]')
            current_price = price_element[0].text_content().split(" ", 1)[0].replace(",", ".")

            last_product_price = (
                DbManager().get_product_price_dao().get_last_price_for_product(session, int(product_id), float(product_quantity))
            )

            if len(last_product_price) == 0:
                p_price_obj = model.ProductPrice(
                    date=datetime.datetime.now().date(),
                    price=float(current_price),
                    product_id=int(product_id),
                    grams=float(product_quantity),
                )

                p_price_obj = DbManager().get_product_price_dao().create_product_price(session, p_price_obj)

            elif len(last_product_price) == 1 and last_product_price[0].to_dict()["price"] != float(current_price):
                p_price_obj = model.ProductPrice(
                    date=datetime.datetime.now().date(),
                    price=float(current_price),
                    product_id=int(product_id),
                    grams=float(product_quantity),
                )

                p_price_obj = DbManager().get_product_price_dao().create_product_price(session, p_price_obj)

                DbManager().get_product_price_dao().update_next_price(last_product_price[0].id, p_price_obj.id)

            elif len(last_product_price) > 1:
                # This is an error with the query and / or the data
                print("ERROR")

        return None


if __name__ == "__main__":
    try:
        scrapper = Scrapper()
        products_path = scrapper.get_product_path()
        for product_path in products_path:
            scrapper.process_product(product_path)
    except Exception as e:
        logging.exception("Something awful happened!")
        # print(e)
        # print(e.exec_info()[0])
    finally:
        scrapper.close_browser()
