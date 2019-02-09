from db_model import User, Base
from abc import ABC, abstractmethod

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from abc import ABC, abstractmethod

class Base_DB_Manager(ABC):

    def __init__(self):
        self._engine = create_engine('postgresql://postgres:feedbuzz@localhost/feedbuzz')

    @abstractmethod
    def save(self):
        pass

class User_DB_Manager(Base_DB_Manager):

    def save(self, person):
        pass
