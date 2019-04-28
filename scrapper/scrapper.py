#!/usr/bin/python3
# https://stackoverflow.com/questions/17380869/get-list-items-inside-div-tag-using-xpath

import requests
import time
import re

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

    def __init__(self):
        DbManager._engine = create_engine("postgresql://postgres:feedbuzz@localhost:5430/feedbuzz")
        DbManager._ProductDAO = dao.ProductDAO(DbManager._engine, self._get_config())
        # DbManager._Session = sessionmaker(bind = self._engine)

    @classmethod
    def _get_config(cls):
        cls.configs = ConfigurationLoader().load_config()
        return cls.configs

    # @classmethod
    # def get_session(cls):
    #     return cls._Session()

    @classmethod
    def get_product_dao(cls):
        return cls._ProductDAO


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
        # while is_page_valid:
        url = "{}fr-CA/Rechercher?keywords=*&sortDirection=asc&page={}".format(self._base_url, compteur)
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

        search_results = product_dao.find_by_identifiant(identifiant)
        # pprint("my search")
        # pprint(search_results)
        # pprint(len(search_results))
        # search_results = session.query(model.Product).filter(model.Product.identifiant == identifiant).all()

        if len(search_results) > 1:
            print("exeption, Product multiple time in DB")
            return False

        url = "{}{}".format(self._base_url, path, identifiant)

        # Prepare the html data
        self.browser.get(url)
        self.browser.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;"
        )
        time.sleep(0.5)

        if len(search_results) == 0:
            self._get_product_data(url, identifiant)

            # Check prices for each quantity
            self._get_product_price()

        # Check if avalible quantity

    def _get_product_data(self, url, identifiant):

        content = self.browser.page_source
        tree = html.fromstring(content)

        # Section thc and cbd
        cannab_data = tree.xpath(
            '//div[@class="product-details"]//section[@id="product-infos"]//div[@data-templateid="ProductInfosCannab"]//ul[@class="list-unstyled"]'
        )
        product = model.Product(identifiant=identifiant)
        cannab = cannab_data[0].text_content()
        cannab_attributes = re.findall(r"(\d+)", cannab)
        product.thc_min = cannab_attributes[0]
        product.thc_max = cannab_attributes[1]
        product.cbd_min = cannab_attributes[2]
        product.cbd_max = cannab_attributes[3]

        # Section name
        product.name = tree.xpath('//h1[@property="name"]')[0].text_content()
        product.url = url
        product.image_url = tree.xpath('//div[@class="product-details-media"]//img[@class="img-fluid"]/@src')[0]
        product.identifiant = identifiant

        # TODO category type
        product_spec = tree.xpath('//div[@class="product-specifications  js-spec"]//p[@class="item"]')
        type_id = 0

        # product_dao = DbManager().get_product_dao().create_product(product)
        return None

    def _process_product_quantity(self, html_tree):
        return

    def _get_product_price(self):

        script = """
            document.getElementById("ageModal").remove();
            var lights = document.getElementsByClassName("modal-backdrop");
            while (lights.length)
            lights[0].classList.remove("modal-backdrop");
        """
        self.browser.execute_script(script)

        content = self.browser.page_source
        tree = html.fromstring(content)

        # Get number of button which indicate the number of formats offert for this product
        qty_btns = tree.xpath('//div[@data-qa="product-variants"]//button')
        for index, btn in enumerate(qty_btns):
            button = self.browser.find_element_by_xpath(
                '//div[@data-qa="product-variants"]//button[{}]'.format(index + 1)
            )
            button.click()
            # Get the price for this quantity
            price_element = tree.xpath('//div[@data-templateid="PriceDiscount"]//span[@property="price"]')
            price = price_element.strip(" ").replace(",", ".")

        return None


if __name__ == "__main__":
    scrapper = Scrapper()
    products_path = scrapper.get_product_path()
    for product_path in products_path:
        scrapper.process_product(product_path)
        break
    scrapper.close_browser()
