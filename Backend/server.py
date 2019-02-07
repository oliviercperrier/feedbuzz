from sanic import Sanic
from sanic.response import json
from api import api

app = Sanic()
app.blueprint(api)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)