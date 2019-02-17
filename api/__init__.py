from sanic import Blueprint
from .user import user, authenticate, retrieve_user
from .base_api import base_api

# next add more blueprint ex: Blueprint.group(auth, comment, url_prefix='/api')
api = Blueprint.group(user, base_api, url_prefix='/api')
authenticate = authenticate
retrieve_user = retrieve_user