from .model import User, Base, Product, RefreshToken
from abc import ABC, abstractmethod
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import exc
import os


class BaseDAO(ABC):

    def __init__(self):
        DATABASE_URL = os.environ['DATABASE_URL']
        self._engine = create_engine(DATABASE_URL)
        #self._engine = create_engine('postgresql://postgres:feedbuzz@localhost:5430/feedbuzz')
        self._session = None

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


class UserDAO(BaseDAO):

    def get(self, id):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        user = self._session.query(User).filter_by(id=id).first()
        self._session.close()
        return user

    def get_by_email(self, email):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        user = self._session.query(User).filter_by(email=email).first()
        self._session.close()
        return user


class ProductDAO(BaseDAO):

    def get(self, id):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        product = self._session.query(Product).filter_by(id=id).first()
        self._session.close()
        return product

    def get_by_name(self, name):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        product = self._session.query(Product).filter_by(name=name).first()
        self._session.close()
        return product

    def get_all(self):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        product_list = self._session.query(Product).all()
        self._session.close()
        return product_list

    def find_by_name(self, query):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        search_results = self._session.query(Product).filter(Product.name.ilike(query + "%")).all()
        return search_results

class RefreshTokenDAO(BaseDAO):

    def get_by_user_id(self, user_id):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        refresh_token = self._session.query(RefreshToken).filter_by(user_id=user_id).first()
        return  refresh_token
