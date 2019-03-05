from .model import User, Base, Product
from abc import ABC, abstractmethod
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


class BaseDAO(ABC):

    def __init__(self):
        self._engine = create_engine('postgresql://postgres:feedbuzz@localhost:5430/feedbuzz')

    def save(self, entity):
        pass

    @abstractmethod
    def get(self, id):
        pass


class UserDAO(BaseDAO):

    def get(self, id):
        Session = sessionmaker(bind=self._engine)
        session = Session()
        user = session.query(User).filter_by(id=id).first()
        session.close()
        return user

    def get_by_username(self, username):
        Session = sessionmaker(bind=self._engine)
        session = Session()
        user = session.query(User).filter_by(email=username).first()
        session.close()
        return user


class ProductDAO(BaseDAO):

    def get(self, id):
        Session = sessionmaker(bind=self._engine)
        session = Session()
        product = session.query(Product).filter_by(id=id).first()
        session.close()
        return product

    def get_by_name(self, name):
        Session = sessionmaker(bind=self._engine)
        session = Session()
        product = session.query(Product).filter_by(name=name).first()
        session.close()
        return product

    def get_all(self):
        Session = sessionmaker(bind=self._engine)
        session = Session()
        product_list = session.query(Product).all()
        session.close()
        return product_list

    def find_by_name(self, query):
        Session = sessionmaker(bind=self._engine)
        session = Session()
        search_results = session.query(Product).filter(Product.name.like("%" + query + "%")).all()
        return search_results
