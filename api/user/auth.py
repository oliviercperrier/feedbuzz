from sanic import Blueprint
from sanic_jwt import protected
from sanic.response import json

auth = Blueprint('auth', url_prefix='/auth')



async def authenticate(request):
    return True

@auth.route('/signup')
async def sign_up(request):
    return json({'message': 'success'})

