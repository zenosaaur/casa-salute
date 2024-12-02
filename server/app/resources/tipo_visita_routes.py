from flask import Blueprint, jsonify,request
from ..repositories.tipo_visita_repository import TipoVisitaRepository
from ..extensions import db

bp = Blueprint('tipovisita', __name__, url_prefix='/')



@bp.route('/tipivisita', methods=['GET'])
def getTipiVisita():
    repo = TipoVisitaRepository(db.session)
    return repo.getTipiVisita()


@bp.route('/tipovisita/<string:id_tipovisita>', methods=['GET'])
def getTipoVisitaById(id_tipovisita):
    repo = TipoVisitaRepository(db.session)
    return repo.getTipoVisitaById(id_tipovisita)


@bp.route('/tipovisita', methods=['POST'])
def createTipoVisita():
    repo = TipoVisitaRepository(db.session)
    return repo.createTipoVisita()


@bp.route('/tipovisita/<string:id_tipovisita>', methods=['PUT'])
def updateTipoVisita(id_tipovisita):
    repo = TipoVisitaRepository(db.session)
    return repo.updateTipoVisita(id_tipovisita)