from sanic import Sanic
from sanic.response import json, file
from api import api, authenticate, retrieve_user, store_refresh_token, retrieve_refresh_token
from sanic.exceptions import NotFound
from sanic.log import logger
from sanic_jwt import Initialize

app = Sanic(__name__)

#ADD config db host for prod vs dev
app.config.from_envvar('MYAPP_CONFIGS')

Initialize(app, authenticate=authenticate,
 retrieve_user=retrieve_user,
 refresh_token_enabled=True,
 retrieve_refresh_token=retrieve_refresh_token,
 store_refresh_token=store_refresh_token)

if app.config.ENV == "production":
    app.static('/', './client/build/index.html')
    app.static('/', './client/build')
    app.static('/static', './client/static')

"""
    When an endpoint is not found, redirect to index.html and react takes the lead
"""
@app.exception(NotFound)
async def index(request, exception):
    return await file('./client/build/index.html')

app.blueprint(api)
app.run(host="0.0.0.0", port=app.config.PORT)


