from .model import User, Base, Product, RefreshToken
from abc import ABC, abstractmethod
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


class BaseDAO(ABC):

    def __init__(self):
        self._engine = create_engine('postgresql://postgres:feedbuzz@localhost:5430/feedbuzz')

    def save(self, entity):
        Session = sessionmaker(bind=self._engine)
        session = Session()
        
        try:
            session.add(entity)
            session.commit()
        except exc.IntegrityError as e:
            print(e.args[0])
            session.rollback()

        session.close()


class UserDAO(BaseDAO):

    def get(self, id):
        Session = sessionmaker(bind=self._engine)
        session = Session()
        user = session.query(User).filter_by(id=id).first()
        session.close()
        return user

    def get_by_email(self, email):
        Session = sessionmaker(bind=self._engine)
        session = Session()
        user = session.query(User).filter_by(email=email).first()
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

class RefreshTokenDAO(BaseDAO):

    def get_by_user_id(self, user_id):
        Session = sessionmaker(bind=self._engine)
        session = Session()
        refresh_token = session.query(RefreshToken).filter_by(user_id=user_id).first()
        session.close()
        return  refresh_token