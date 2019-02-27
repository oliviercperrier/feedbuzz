from .model import User, Base
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
    
