from sanic import Sanic
from sanic.response import json, file
from api import api, serve_configs_api, authenticate, retrieve_user, store_refresh_token, retrieve_refresh_token
from sanic.exceptions import NotFound
from sanic.log import logger
from sanic_jwt import Initialize
import json
import os
from db import serve_configs_db, serve_engine_to_db, dao_instance
from configs import ConfigurationLoader
from bootstrap import BaseApplication

class FeedBuzzServer(BaseApplication):

    def _on_start(self):
        app = Sanic(__name__)

        Initialize(app, authenticate=authenticate,
        retrieve_user=retrieve_user,
        refresh_token_enabled=True,
        retrieve_refresh_token=retrieve_refresh_token,
        store_refresh_token=store_refresh_token)

        if os.environ.get('ENV') == "PROD":
            app.static('/', './client/build')
            app.static('/static', './client/static')

        #When an endpoint not found, redirect to index.html and react takes the lead
        @app.exception(NotFound) 
        async def index(request, exception):
            return await file('./client/build/index.html')

        app.blueprint(api)

        #Print all routes
        for handler, (rule, router) in app.router.routes_names.items():
            print(rule)

        if __name__ == '__main__':
            app.run(
                access_log=True,
                host='0.0.0.0',
                port=int(os.environ.get('PORT', 8000)),
                workers=int(os.environ.get('WEB_CONCURRENCY', 1)),
                debug=bool(os.environ.get('DEBUG', '')))

    def _get_needs_providing_func(self):
        provide_funcs = {}
        
        # This order is very important !!!!
        provide_funcs['configs_funcs'] = [
            serve_configs_db,
            serve_configs_api,
        ]

        provide_funcs['engine_funcs'] = [
            serve_engine_to_db
        ]

        return provide_funcs


feebuzz_app = FeedBuzzServer()
feebuzz_app.start()