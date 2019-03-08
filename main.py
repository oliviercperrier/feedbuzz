from sanic import Sanic
from sanic.response import json, file
from api import api, serve_configs_api, authenticate, retrieve_user, store_refresh_token, retrieve_refresh_token
from sanic.exceptions import NotFound
from sanic.log import logger
from sanic_jwt import Initialize
import json
import os
from db import serve_configs_db
from configs import ConfigurationLoader

def serve_configs_to_app(app_configs):
    serve_configs_api(app_configs)
    serve_configs_db(app_configs)


config_l = ConfigurationLoader()
app_configs = config_l.load_config()
serve_configs_to_app(app_configs)

app = Sanic(__name__)

Initialize(app, authenticate=authenticate,
 retrieve_user=retrieve_user,
 refresh_token_enabled=True,
 retrieve_refresh_token=retrieve_refresh_token,
 store_refresh_token=store_refresh_token)

if os.environ.get('ENV') == "production":
    app.static('/', './client/build')
    app.static('/static', './client/static')

#When an endpoint is not found, redirect to index.html and react takes the lead
@app.exception(NotFound) 
async def index(request, exception):
    return await file('./client/build/index.html')

app.blueprint(api)

if __name__ == '__main__':
    app.run(
        access_log=True,
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 8000)),
        workers=int(os.environ.get('WEB_CONCURRENCY', 1)),
        debug=bool(os.environ.get('DEBUG', '')))
