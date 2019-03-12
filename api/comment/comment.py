
from sanic import Blueprint
from sanic import response
import sanic
import json
from db import  CommentDAO

comment = Blueprint('comment', url_prefix='')


comment_dao = None

def serve_configs_product(configs):
    print("Serve configs in product")
    global product_dao
    comment_dao = CommentDAO(configs)

    global app_configs
    app_configs = configs

@comment.route('/user/<id>')
async def get_by_user_id(request, id):
    comments = comment_dao.get_comment_by_user(id)
    return

@comment.route('/create')
async def create_comment(request: sanic.json):
    print(request.json)
