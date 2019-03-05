
from sanic import Blueprint
from db import ProductDAO

product_endpoint = Blueprint('product')

product_dao = ProductDAO()

@product_endpoint.route('/<id>')
async def get_by_id(request, id):
    product = product_dao.get(id)
    return product

