from sanic import Blueprint
from sanic import response
from pprint import pprint
import sanic
from sanic.response import json
from sanic_jwt.decorators import inject_user, protected
from db import RatingDAO, ProductDAO, Rating, RatingStep
from sanic.log import logger
from db import dao_instance

rating = Blueprint("rating", url_prefix="/rating")
rating_dao = None

def serve_configs_rating(configs):
    print("Serve configs in rating")
    global rating_dao
    global product_dao

    rating_dao = dao_instance(RatingDAO)
    product_dao = dao_instance(ProductDAO)

    global app_configs
    app_configs = configs


@rating.route("/product/<id:int>")
async def get_by_product(request, id: int):
    ratings = rating_dao.get_rating_by_product(id)
    logger.info(ratings)
    return response.json([rating.to_dict() for rating in ratings])

@rating.route("/user/<id:int>")
async def get_by_user(request, id: int):
    ratings = rating_dao.get_rating_by_user(id)
    logger.info(ratings)
    rating_array = []

    # Add the product info in the response
    for rating in ratings:
        rating_dict = rating.to_dict()
        product = product_dao.get(rating_dict["product_id"])
        product_dict = product_dao.to_dict(product)
        rating_dict["product"] = product_dict
        rating_dict.pop("product_id")
        rating_array.append(rating_dict)

    return response.json(rating_array)

@rating.route("/", methods=["POST"])
@protected()
async def create_rating(request):
    user_id = request["user"].id
    product = request.json.get("product_id")
    rating_steps = []

    high_step = request.json.get("0")
    rating_steps.append(RatingStep(step_type="high", rating=high_step.get("value")))
    
    red_eye_step = request.json.get("1")
    rating_steps.append(RatingStep(step_type="red_eye", rating=high_step.get("value")))

    effects_step = request.json.get("2")
    rating_steps.append(RatingStep(step_type="effects", common=effects_step.get("commonEffects"), added=effects_step.get("addedEffects")))

    flavors_step = request.json.get("3")
    rating_steps.append(RatingStep(step_type="flavors", common=flavors_step.get("commonFlavors"), added=flavors_step.get("addedFlavors")))

    final_comment_step = request.json.get("4")
    rating = Rating(user_id=user_id, comment=final_comment_step.get("comment"), rating=final_comment_step.get("rating"), product_id=product)

    rating_dao.save(rating, rating_steps)

    return json({'success': True})
