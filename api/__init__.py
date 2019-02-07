from sanic import Blueprint
from .user import auth

# next add more blueprint ex: Blueprint.group(auth, comment, url_prefix='/api')
api = Blueprint.group(auth, url_prefix='/api')

