from sanic import Blueprint
from .product import *

# next add more blueprint ex: auth, comment, ...
product = Blueprint.group(product, url_prefix='')
get_by_id = get_by_id
get_all_products = get_all_products
find_product = find_product
