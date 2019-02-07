# api/content/__init__.py
from sanic import Blueprint

from .test import test_bp
from .static import static
from .authors import authors

content = Blueprint.group(static, authors, test_bp, url_prefix='/content')