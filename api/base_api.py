from sanic import Blueprint
from sanic_jwt.decorators import inject_user

base_api = Blueprint('base_api')


# Insert all middlewar here

@base_api.middleware('request')
@inject_user()
async def test(request, user):
	request['user'] = user 