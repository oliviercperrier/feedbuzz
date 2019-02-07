from sanic import Blueprint
from .test_blue_print import test

test_bp = Blueprint.group(test, url_prefix='/test')