from sanic import Blueprint
from sanic_jwt.decorators import inject_user, protected
from sanic_jwt import exceptions
from sanic.response import json
from db import UserDAO

auth = Blueprint('auth', url_prefix='/auth')

user_dao = UserDAO()

async def authenticate(request):
	username = request.json.get('username')
	password = request.json.get('password')

	if not username or not password:
		raise exceptions.AuthenticationFailed('Invalid credential')

	user = user_dao.get_by_username(username)

	if not user:
		raise exceptions.AuthenticationFailed('Invalid credential')

	if password == user.password:
		return user
	else:
		raise exceptions.AuthenticationFailed('Invalid credential')

async def retrieve_user(request, payload, *args, **kwargs):
	if payload:
		user_id = payload.get('user_id', None)
		user = user_dao.get(user_id)
		return user

@auth.route('/signup')
async def sign_up(request):
	print(request)
	return json({'message': 'message'})

