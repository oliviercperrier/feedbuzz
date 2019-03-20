from sanic import Blueprint
from sanic import response
import json
from db import EvaluationDAO

evaluation = Blueprint('evaluation', url_prefix='/evaluation')

evaluation_dao = EvaluationDAO()

@evaluation.route('/<id>')
async def get_by_id(request, id):
    evaluation = evaluation_dao.get(id)
    return response.json(json.dumps(evaluation.to_dict()))