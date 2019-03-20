from .model import User, Base, RefreshToken, serve_configs_model, Comment, CommentRatingStep
from .dao import UserDAO, ProductDAO, RefreshTokenDAO, serve_configs_dao, CommentDAO

# Model
User = User
Base = Base
RefreshToken = RefreshToken

# DAO
UserDAO = UserDAO
ProductDAO = ProductDAO
RefreshTokenDAO = RefreshTokenDAO
CommentDAO = CommentDAO


def serve_configs_db(configs):
    serve_configs_dao(configs)
    serve_configs_model(configs)
