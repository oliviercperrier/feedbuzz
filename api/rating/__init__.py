from .rating import *
from sanic import Blueprint


comment = Blueprint.group(rating, url_prefix='')

