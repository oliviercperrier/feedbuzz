from .model import User, Base, RefreshToken, serve_configs_model, Rating, RatingStep 
from .dao import UserDAO, ProductDAO, RefreshTokenDAO, serve_configs_dao, RatingDAO

# Model
User = User
Base = Base
RefreshToken = RefreshToken

# DAO
UserDAO = UserDAO
ProductDAO = ProductDAO
RefreshTokenDAO = RefreshTokenDAO
RatingDAO = RatingDAO


def serve_configs_db(configs):
    serve_configs_dao(configs)
    serve_configs_model(configs)
