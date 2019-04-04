from .model import User, Base, Product, RefreshToken, Rating, ProductType
from abc import ABC, abstractmethod
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, raiseload, joinedload
from sqlalchemy import exc
from sqlalchemy.sql import func
from pprint import pprint
import os

app_configs = None
daos = {}
db_engine = None

def serve_configs_dao(configs):
	print("Serve configs to dao")
	global app_configs
	app_configs = configs

def serve_db_engine_to_dao(engine):
    print("Serve db engine to dao")
    global db_engine
    db_engine = engine


class BaseDAO(ABC):

    def __init__(self, engine, configs):
        self._engine = engine
        self._session = None
        self._configs = configs

    def save(self, entity):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        
        try:
            self._session.add(entity)
            self._session.commit()
        except exc.IntegrityError as e:
            print(e.args[0])
            self._session.rollback()

        self._session.close()

    def commit(self):
        self._session.commit()
        self._session.close()

    def close(self):
        self._session.close()


class UserDAO(BaseDAO):

    def get(self, id):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        user = self._session.query(User).filter_by(id=id).first()
        return user

    def get_by_email(self, email):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        user = self._session.query(User).filter_by(email=email).first()
        self.close()
        return user


class ProductDAO(BaseDAO):

    def to_dict(self, prod):
        rating_dao = dao_instance(RatingDAO)
        return {
            "id": prod.id,
            "name": prod.name,
            "type_id": prod.type_id,
            "url": prod.url,
            "image_url": prod.image_url,
            "thc_min": prod.thc_min,
            "thc_max": prod.thc_max,
            "cbd_min": prod.cbd_min,
            "cbd_max": prod.cbd_max,
            "price": [price.to_dict() for price in prod.prices],
            "avg": rating_dao.get_average_rating_by_product(prod.id)
        }

    def get(self, id):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        product = self._session.query(Product).filter_by(id=id).first()
        self.close()
        return product

    def get_by_name(self, name):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        product = self._session.query(Product).filter_by(name=name).first()
        self.close()
        return product

    def get_all(self, args):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        product_list = self._session.query(Product).join(ProductType).filter(*args).all()
        self.close()
        return product_list

    def find_by_name(self, query):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        search_results = self._session.query(Product).filter(Product.name.ilike(query + "%")).all()
        self.close()
        return search_results


class RefreshTokenDAO(BaseDAO):

    def get_by_user_id(self, user_id):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        refresh_token = self._session.query(RefreshToken).filter_by(user_id=user_id).first()
        # dont close now
        return  refresh_token

class RatingDAO(BaseDAO):
    def get_rating_by_product(self, product: int):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        ratings = self._session.query(Rating).filter_by(product_id=product).all()
        self._session.close()
        return ratings

    def get_average_rating_by_product(self, product: int):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        rating_avg_rating = self._session.query(func.avg(Rating.rating)).filter_by(product_id=product).first()
        self._session.close()
        return rating_avg_rating

    def get_rating_by_user(self, user_id):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        comments = self._session.query(Rating).filter_by(user_id=user_id)
        self._session.close()
        return comments

    def save(self, rating, rating_step):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        self._session.add(rating)
        self._session.flush()
        self._session.refresh(rating)
        for step in rating_step:
            step.rating_id = rating.id
            self._session.add(step)
        res = self._session.commit()
        self._session.close()

    def get_rating_by_user_and_product(self, prodcut_id, user_id):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        rating = self._session.query(Rating).filter_by(prodcut_id=prodcut_id).filter_by(user_id=user_id).first()
        self._session.close()
        return rating


    def delete_rating(self, rating):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        self._session.delete(rating)
        self._session.close()



def dao_instance(instance_type):
    if instance_type in daos:
        return daos[instance_type]
    else:
        daos[instance_type] = instance_type(db_engine, app_configs)
        return daos[instance_type]   
