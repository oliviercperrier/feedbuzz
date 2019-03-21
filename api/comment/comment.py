from sanic import Blueprint
from sanic import response
from pprint import pprint
import sanic
from sanic.response import json
from db import CommentDAO, Comment, CommentRatingStep
from sanic.log import logger
import json as baseJson

comment = Blueprint("comment", url_prefix="/comment")


comment_dao = None


def serve_configs_comment(configs):
    print("Serve configs in comment")
    global comment_dao
    comment_dao = CommentDAO(configs)
    print(comment_dao)

    global app_configs
    app_configs = configs


@comment.route("/product/<id:int>")
async def get_by_product(request, id: int):
    comments = comment_dao.get_comment_by_product(id)
    logger.info(comments)
    return response.json([comment.to_dict() for comment in comments])


@comment.route("/", methods=["POST"])
async def create_comment(request):
    author_id = request.json.get("author_id")
    content = request.json.get("content")
    score = request.json.get("score")
    product = request.json.get("product_id")

    comment = Comment(author_id=author_id, content=content, score=score, product_id=product)

    logger.info(request.json.get("commentStep"))
    comment_steps = []

    for step_type, step_data in request.json.get("commentStep").items():
        comment_steps.append(
            CommentRatingStep(
                step=step_type, common=step_data["common"], added=step_data["added"], rating=step_data["rating"]
            )
        )

    res = comment_dao.save(comment, comment_steps)
    return json({"success": True})
