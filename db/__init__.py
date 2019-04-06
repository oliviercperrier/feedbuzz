from .model import User, Base, RefreshToken, serve_configs_model, Rating, RatingStep, Product, ProductType
from .dao import UserDAO, ProductDAO, RefreshTokenDAO, serve_configs_dao, RatingDAO, dao_instance, serve_db_engine

# Model
User = User
Base = Base
RefreshToken = RefreshToken

# DAO
UserDAO = UserDAO
ProductDAO = ProductDAO
RefreshTokenDAO = RefreshTokenDAO
RatingDAO = RatingDAO

dao_instance = dao_instance


def serve_configs_db(configs):
    serve_configs_dao(configs)
    serve_configs_model(configs)

def serve_engine_to_db(engine):
    serve_db_engine(engine)
