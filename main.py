from sanic import Sanic
from sanic.response import json, file
from api import api, authenticate, retrieve_user
from sanic.exceptions import NotFound
from sanic.log import logger
from sanic_jwt import Initialize

app = Sanic(__name__)

#ADD config db host for prod vs dev
app.config.from_envvar('MYAPP_CONFIGS')

Initialize(app, authenticate=authenticate, retrieve_user=retrieve_user)

if app.config.ENV == "production":
    app.static('/', './client/build')
    app.static('/static', './client/static')

"""
    Ne fonctionne pass calisse...
    Avec React, les routes sont client side. Donc si je navigate dans 
    l'application normalement tout est chill. Par contre, si j'essais d'accéder
    directement à une page en ecrivant dans le browser ex.: http://localhost/authenticate
    j'ai une page not found.

    La route suivante est sensé rediriger l'app vers index.html quand un endpoint n'existe
    pas coté backend pour que ce soit le frontend qui le gère, mais ca fonctionne pas..
    C'est pourtant comme ca qu'il faut faire.
"""
@app.route("/")
async def index(request):
    return await file('./client/build/index.html')

app.blueprint(api)
app.run(host="0.0.0.0", port=app.config.PORT)


