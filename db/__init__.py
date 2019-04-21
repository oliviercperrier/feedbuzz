from .model import User, Base, RefreshToken, serve_configs_model, Rating, RatingStep, Product, ProductType
from .dao import UserDAO, ProductDAO, RefreshTokenDAO, serve_configs_dao, RatingDAO, dao_instance, serve_db_engine_to_dao
from .feedbuzz_migration import serve_configs_to_db_migration, upgrade_database, serve_db_engine_to_migration, check_for_migration_setup

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

# DB migration
upgrade_database = upgrade_database
check_for_migration_setup = check_for_migration_setup

def serve_configs_db(configs):
    serve_configs_dao(configs)
    serve_configs_model(configs)
    serve_configs_to_db_migration(configs)

def serve_engine_to_db(engine):
    serve_db_engine_to_dao(engine)
    serve_db_engine_to_migration(engine)
