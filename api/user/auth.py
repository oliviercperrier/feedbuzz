from sanic import Blueprint
from sanic_jwt.decorators import inject_user, protected
from sanic_jwt import exceptions
from sanic.exceptions import ServerError
from sanic.response import json
from db import UserDAO, RefreshTokenDAO
from db import User, RefreshToken
import hashlib
import os
from sanic.log import logger
import boto3
import base64

auth = Blueprint("auth")

user_dao = None
refresh_token_dao = None


def serve_configs_auth(configs):
    print("Serve configs to auth")
    global refresh_token_dao
    refresh_token_dao = RefreshTokenDAO(configs)

    global user_dao
    user_dao = UserDAO(configs)

    global app_configs
    app_configs = configs


async def authenticate(request):
    email = request.json.get("email")
    password = request.json.get("password")

    if not email or not password:
        raise exceptions.AuthenticationFailed("Invalid credential")

    user = user_dao.get_by_email(email)

    if not user:
        raise exceptions.AuthenticationFailed("Invalid credential")

    salt = app_configs.SALT
    password_string = password + salt
    hashed_password = hashlib.sha512(password_string.encode("utf-8")).hexdigest()

    if hashed_password == user.password:
        return user
    else:
        raise exceptions.AuthenticationFailed("Invalid credential")


async def retrieve_user(request, payload, *args, **kwargs):
	if payload:
		user_id = payload.get('user_id', None)
		user = user_dao.get(user_id)
		user_dao.close()
		return user

async def store_refresh_token(user_id, refresh_token, *args, **kwargs):
    r_token = refresh_token_dao.get_by_user_id(user_id)
    if r_token:
        r_token.token = refresh_token
        refresh_token_dao.commit()
    else:
        r_token = RefreshToken(user_id=user_id, token=refresh_token)
        refresh_token_dao.save(r_token)


async def retrieve_refresh_token(request, user_id, *args, **kwargs):
    r_token = refresh_token_dao.get_by_user_id(user_id)
    return r_token.token


@auth.route("/signup", methods=["POST"])
async def sign_up(request):
	email = request.json.get('email')
	password = request.json.get('password')
	username = request.json.get('username')
	name = request.json.get('name')

	if not email or not password or not username or not name:
		raise ServerError("username and password and email and name needed", status_code=400)

	if user_dao.get_by_email(email):
		return json({'success': False, 'message': 'Email already exist'})	

	salt = app_configs.SALT
	password_string = password + salt
	hashed_password = hashlib.sha512(password_string.encode('utf-8')).hexdigest()
	user = User(username=username, email=email, password=hashed_password, name=name)
	user_dao.save(user)
	return json({'success': True})

@auth.route('', methods=['PUT'])
@protected()
async def put(request):
	current_user = request['user']

	profile_image = request.json.get('image')
	email = request.json.get('email')
	username = request.json.get('username')
	name = request.json.get('name')
	gender =request.json.get('gender')

	if not email or not username or not name:
		raise ServerError('username and email and name needed', status_code=400)

	image_url = None
	user = user_dao.get(current_user.id)

	if profile_image is not None:
		succeed = save_profile_image(profile_image, current_user.id)
		if succeed:
			image_url = app_configs.S3_BASE_URL + 'profile_image{}.jpeg'.format(current_user.id)

	user.email = email
	user.username = username
	user.name = name
	user.gender = gender
	user.image_url = image_url
	new_user = user.to_dict()
	user_dao.commit()
	return json({'me': new_user})

def save_profile_image(base46_string, user_id):
	s3 = boto3.resource(
    	's3',
    	aws_access_key_id=app_configs.S3_KEY,
    	aws_secret_access_key=app_configs.S3_TOKEN
	)

	image_name = 'profile_image{}.jpeg'.format(user_id)
	content = base64.b64decode(base46_string)    
	response = s3.Object('feedbuzz', 'images/{}'.format(image_name)).put(Body=content, ContentType='image/jpeg')

	try_count = 1
	while response['ResponseMetadata']['HTTPStatusCode'] is not 200 and try_count < 3:
		response = s3.Object('feedbuzz', 'images/{}'.format(image_name)).put(Body=content, ContentType='image/jpeg')
		try_count += 1
	
	return response['ResponseMetadata']['HTTPStatusCode'] == 200