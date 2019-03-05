
from sanic import Blueprint
from sanic import response
import json
from db import ProductDAO

product = Blueprint('product', url_prefix='/products')

product_dao = ProductDAO()

@product.route('/<id>')
async def get_by_id(request, id):
    product = product_dao.get(id)
    return await response.json(product)

@product.route('/all')
async def get_all_products(request):
    product_list = product_dao.get_all()
    return response.text(json.dumps([json.dumps(product.to_dict()) for product in product_list]))

@product.route('/find/<query>')
async def find_product(request, name):
    search_results = product_dao.find_by_name(name)
    return await response.json(search_results)



