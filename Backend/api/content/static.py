# api/content/static.py
from sanic import Blueprint
from sanic.response import json

static = Blueprint('content_static', url_prefix='/static')

@static.route('/')
async def bp_root(request):
    return json({'my': 'static'})