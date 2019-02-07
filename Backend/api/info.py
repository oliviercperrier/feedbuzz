# api/info.py
from sanic import Blueprint
from sanic.response import json

info = Blueprint('info', url_prefix='/info')

@info.route('/')
async def bp_root(request):
    return json({'my': 'info'})