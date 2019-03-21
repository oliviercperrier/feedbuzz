from sanic import Blueprint
from sanic import response
from pprint import pprint
import sanic
from sanic.response import json
from sanic_jwt.decorators import inject_user, protected
from db import RatingDAO, Rating, RatingStep
from sanic.log import logger

rating = Blueprint("rating", url_prefix="/rating")
rating_dao = None

def serve_configs_rating(configs):
    print("Serve configs in rating")
    global rating_dao
    rating_dao = RatingDAO(configs)
    print(rating_dao)

    global app_configs
    app_configs = configs


@rating.route("/product/<id:int>")
async def get_by_product(request, id: int):
    ratings = rating_dao.get_rating_by_product(id)
    logger.info(ratings)
    return response.json([rating.to_dict() for rating in ratings])


@rating.route("/", methods=["POST"])
@protected()
async def create_rating(request):
    user_id = request["user"].user_id
    comment = request.json.get("comment")
    rating = request.json.get("rating")
    product = request.json.get("product_id")

    rating = Rating(user_id=user_id, comment=comment, rating=rating, product_id=product)

    rating_step = []

    for step_type, step_data in request.json.get("ratingStep").items():
        rating_step.append(
                RatingStep(step_type=step_type, common=step_data["common"], added=step_data["added"], rating=step_data["rating"])
        )

    res = rating_dao.save(rating, rating_step)
    return json({"success": True})
