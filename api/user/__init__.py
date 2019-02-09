from sanic import Blueprint
from .auth import auth, authenticate

# next add more blueprint ex: auth, comment, ...
user = Blueprint.group(auth, url_prefix='/user')
authenticate = authenticate