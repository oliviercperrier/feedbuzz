from sanic import Blueprint
from .user import user, authenticate

# next add more blueprint ex: Blueprint.group(auth, comment, url_prefix='/api')
api = Blueprint.group(user, url_prefix='/api')
authenticate = authenticate

