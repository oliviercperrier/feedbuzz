from sanic import Blueprint
from sanic.response import json

auth = Blueprint('auth', url_prefix='/auth')


@auth.route('/signup')
async def sign_up(request):
    return json({'message': 'success'})


@auth.route('/login')
async def login(request):
    return json({'message': 'connected'})
