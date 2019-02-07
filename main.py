from sanic import Sanic
from sanic.response import json
from api import api
from sanic.exceptions import NotFound
from sanic.log import logger

app = Sanic(__name__)

@app.route("/")
async def index(request):
    return json({"hello": "world"})

@app.exception(NotFound)
def ignore_404s(request, exception):
    logger.info("page not found") 
    return json({"hello": "not there"})


app.blueprint(api)
app.run(host="0.0.0.0", port=8000)


