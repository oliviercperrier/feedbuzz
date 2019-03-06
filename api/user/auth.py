from sanic import Blueprint
from sanic_jwt.decorators import inject_user, protected
from sanic_jwt import exceptions
from sanic.exceptions import ServerError
from sanic.response import json
from db import UserDAO, RefreshTokenDAO
from db import User, RefreshToken
import hashlib

auth = Blueprint('auth')

user_dao = UserDAO()
refresh_token_dao = RefreshTokenDAO()

async def authenticate(request):
	email = request.json.get('email')
	password = request.json.get('password')

	if not email or not password:
		raise exceptions.AuthenticationFailed('Invalid credential')

	user = user_dao.get_by_email(email)

	if not user:
		raise exceptions.AuthenticationFailed('Invalid credential')

	salt = request.app.config.SALT
	password_string = password + salt
	hashed_password = hashlib.sha512(password_string.encode('utf-8')).hexdigest()

	if hashed_password == user.password:
		return user
	else:
		raise exceptions.AuthenticationFailed('Invalid credential')

async def retrieve_user(request, payload, *args, **kwargs):
	if payload:
		user_id = payload.get('user_id', None)
		user = user_dao.get(user_id)
		return user

async def store_refresh_token(user_id, refresh_token, *args, **kwargs):
	r_token = RefreshToken(user_id=user_id, token=refresh_token)
	refresh_token_dao.save(r_token)

async def retrieve_refresh_token(request, user_id, *args, **kwargs):
	r_token = refresh_token_dao.get_by_user_id(user_id)
	return r_token.token


@auth.route('/signup', methods=['POST'])
async def sign_up(request):
	email = request.json.get('email')
	password = request.json.get('password')
	username = request.json.get('username')

	if not email or not password or not username:
		raise ServerError("username and password and email needed", status_code=400)

	if user_dao.get_by_email(email):
		return json({'success': False, 'message': 'Email already exist'})	

	salt = request.app.config.SALT
	password_string = password + salt
	hashed_password = hashlib.sha512(password_string.encode('utf-8')).hexdigest()
	user = User(username=username, email=email, password=hashed_password)
	user_dao.save(user)
	return json({'success': True})

