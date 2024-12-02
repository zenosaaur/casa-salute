from flask import Blueprint, jsonify,request
from ..repositories.tipo_sala_repository import TipoSalaRepository

from ..extensions import db

bp = Blueprint('tiposala', __name__, url_prefix='/')


@bp.route('/tipisala', methods=['GET'])
def getTipiSala():
    repo = TipoSalaRepository(db.session)
    return repo.getTipiSala()

@bp.route('/tiposala/<string:id_tiposala>', methods=['GET'])
def getTipoSalaById(id_tiposala):
    repo = TipoSalaRepository(db.session)
    return repo.getTipoSalaById(id_tiposala)

@bp.route('/tiposala', methods=['POST'])
def createTipoSala():
    repo = TipoSalaRepository(db.session)
    return repo.createTipoSala()

@bp.route('/tiposala/<string:id_tiposala>', methods=['PUT'])
def updateTipoSala(id_tiposala):
    repo = TipoSalaRepository(db.session)
    return repo.updateTipoSala(id_tiposala)

