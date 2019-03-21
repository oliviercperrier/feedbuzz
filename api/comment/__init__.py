from .comment import *
from sanic import Blueprint


comment = Blueprint.group(comment, url_prefix='')

