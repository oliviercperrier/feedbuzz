from sanic import Blueprint
from sanic.response import json

authors = Blueprint('content_authors', url_prefix='/authors')

@authors.route('/')
async def bp_root(request):
    return json({'my': 'authors'})