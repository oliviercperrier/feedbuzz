from sanic import Blueprint
from .auth import auth, authenticate, retrieve_user

# next add more blueprint ex: auth, comment, ...
user = Blueprint.group(auth, url_prefix='/user')
authenticate = authenticate
retrieve_user = retrieve_user