from model import Product, ProductType, ProductPrice
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy import exc
from pprint import pprint
import requests
import datetime
import os


class InitDatabase:
    def __init__(self):
        self._engine = create_engine(os.environ['DATABASE_URL'])
        Session = sessionmaker(bind=self._engine)
        self._session = Session()

    def pull_data(self, page: int, qty_page: int, province: str, show_hidden=1, count="all") -> list:

        payload = {"page": page, "per_page": qty_page, "province": province, "show_hidden": show_hidden}
        r = requests.get("https://www.budbudbud.ca/api/v1/strains", params=payload)
        return r.json()

    def insert_data(self, data: list):
        pprint(data)
        for product in data:

            create_product_type = False
            p_type_obj = self._session.query(ProductType).filter_by(name=product["type"]).first()

            if p_type_obj is None:
                create_product_type = True
                p_type_obj = ProductType(name=product["type"])

            p_obj = Product(
                name=product["name"],
                thc_min=product["thc_min"],
                thc_max=product["thc_max"],
                cbd_min=product["cbd_min"],
                cbd_max=product["cbd_max"],
                type_id=p_type_obj.id,
                url=product["url"],
                image_url=product["image"]["original_filename"]
            )

            p_price_obj = ProductPrice(
                date=datetime.datetime.now().date(), price=float(product["price"]), product_id=p_obj.id
            )

            try:
                self._session.add(p_obj)
                self._session.add(p_price_obj)
                if create_product_type:
                    self._session.add(p_type_obj)

                self._session.commit()
            except exc.IntegrityError as e:
                print(e.args[0])
                self._session.rollback()
                # ValidationError('Integrity error: {}'.format(e.args[0]))


if __name__ == "__main__":
    initaliserDb = InitDatabase()

    r = initaliserDb.pull_data(1, 50, "qc")
    initaliserDb.insert_data(r["data"])
    for i in range(2, r["meta"]["pagination"]["total_pages"]):
        r = initaliserDb.pull_data(i, 50, "qc")
        initaliserDb.insert_data(r["data"])
