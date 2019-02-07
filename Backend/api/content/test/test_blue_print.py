from sanic.response import json
from sanic import Blueprint

test = Blueprint('my_blueprint')

@test.route('/')
async def bp_root(request):
    return json({'my': 'test'})