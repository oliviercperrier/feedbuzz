from .model import User, Base, RefreshToken, serve_configs_model
from .dao import UserDAO, ProductDAO, RefreshTokenDAO, serve_configs_dao

#Model
User = User
Base = Base
RefreshToken = RefreshToken

#DAO
UserDAO = UserDAO
ProductDAO = ProductDAO
RefreshTokenDAO = RefreshTokenDAO


def serve_configs_db(configs):
	serve_configs_dao(configs)
	serve_configs_model(configs)
