from sanic import Blueprint
from .auth import auth

# next add more blueprint ex: auth, comment, ...
api = Blueprint.group(auth, url_prefix='/user')
