from sanic import Blueprint
from .auth import (
    auth,
    serve_configs_auth,
    authenticate,
    retrieve_user,
    store_refresh_token,
    retrieve_refresh_token,
)

# next add more blueprint ex: auth, comment, ...
user = Blueprint.group(auth, url_prefix="/user")
authenticate = authenticate
retrieve_user = retrieve_user
store_refresh_token = store_refresh_token
retrieve_refresh_token = retrieve_refresh_token


def serve_configs_user(configs):
    serve_configs_auth(configs)
