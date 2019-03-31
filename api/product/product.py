from sanic import Blueprint
from sanic import response
import json
from db import ProductDAO, RatingDAO
from sanic.log import logger

product = Blueprint("product", url_prefix="/products")

product_dao = None
items_per_page = 20


def serve_configs_product(configs):
    print("Serve configs in product")
    global product_dao
    product_dao = ProductDAO(configs)

    global app_configs
    app_configs = configs


@product.route("/<id:int>")
async def get_by_id(request, id):
    product = product_dao.to_dict(product_dao.get(id))
    return response.json(product)


@product.route("/all")
async def get_all_products(request):
    pageOffset = int(request.args.get("pageOffset"))
    product_list: []= product_dao.get_all()
    total = len(product_list)
    items_per_page = 20
    product_list = product_list[pageOffset * items_per_page:(pageOffset * items_per_page) + items_per_page]
    return response.json({
       "total":total,
       "products": [product_dao.to_dict(product) for product in product_list]
    })


@product.route("/find/<query:[A-z0-9]+>")
async def find_product(request, query):
    search_results = product_dao.find_by_name(query)
    pageOffset = int(request.args.get("pageOffset"))
    total = len(search_results)
    items_per_page = 20
    search_results = search_results[pageOffset * items_per_page:(pageOffset * items_per_page) + items_per_page]
    print(len(search_results))
    return response.json({
        "total": total,
        "products": [product_dao.to_dict(product)for product in search_results]
    })
