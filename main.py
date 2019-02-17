from sanic import Sanic
from sanic.response import json
from api import api, authenticate, retrieve_user
from sanic.exceptions import NotFound
from sanic.log import logger
from sanic_jwt import Initialize

app = Sanic(__name__)
Initialize(app, authenticate=authenticate, retrieve_user=retrieve_user)

app.blueprint(api)
app.run(host="0.0.0.0", port=8000)


