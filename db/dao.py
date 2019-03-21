from .model import User, Base, Product, RefreshToken, Comment
from abc import ABC, abstractmethod
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, raiseload, joinedload
from sqlalchemy import exc
from sqlalchemy.sql import func
import os

app_configs = None
def serve_configs_dao(configs):
	print("Serve configs to dao")
	global app_configs
	app_configs = configs

class BaseDAO(ABC):

    def __init__(self, configs):
        self._engine = create_engine(configs.DATABASE_URL)
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
            "avg": CommentDAO(app_configs).get_average_rating_by_product(prod.id)
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

    def get_all(self):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        product_list = self._session.query(Product).all()
        # product_list = self._session.query(Product).options(joinedload('type')).all()
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
        self._session.close()
        return  refresh_token

class CommentDAO(BaseDAO):
    def get_comment_by_product(self, product: int):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        comments = self._session.query(Comment).filter_by(product_id=product)
        return comments

    def get_average_rating_by_product(self, product: int):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
# session.query(func.avg(Rating.field2).label('average')).filter(Rating.url==url_string.netloc)
        comment_avg_rating = self._session.query(func.avg(Comment.score)).filter_by(product_id=product)
        print(comment_avg_rating)

        return comment_avg_rating

    def get_comment_by_user(self, user_id):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        comments = self._session.query(Comment).filter_by(author_id=user_id)
        return comments

    def save(self, comment, comment_steps):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        self._session.add(comment)
        self._session.flush()
        self._session.refresh(comment)
        # res = self._session.commit()
        for step in comment_steps:
            step.comment_id = comment.id
            self._session.add(step)
        res = self._session.commit()
        self._session.close()

    def delete_comment(self, comment):
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
        self._session.delete(comment)
        self._session.close()




