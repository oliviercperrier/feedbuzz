from sanic import Blueprint
from .user import user, authenticate, retrieve_user, store_refresh_token, retrieve_refresh_token
from .product import find_product, get_by_id, get_all_products, product

from .base_api import base_api

# next add more blueprint ex: Blueprint.group(auth, comment, url_prefix='/api')
api = Blueprint.group(user, product, base_api, url_prefix='/api')
authenticate = authenticate
retrieve_user = retrieve_user
store_refresh_token = store_refresh_token
retrieve_refresh_token = retrieve_refresh_token
get_by_id = get_by_id
get_all_products = get_all_products
find_product = find_product
