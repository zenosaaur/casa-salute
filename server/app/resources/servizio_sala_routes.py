from flask import Blueprint, jsonify,request
from ..repositories.servizio_sala_repository import ServizioSalaRepository
from ..extensions import db


bp = Blueprint('serviziosala', __name__, url_prefix='/')

@bp.route('/servizisala', methods=['GET'])
def getServiziSala():
    repo = ServizioSalaRepository(db.session)
    return repo.getServiziSala()

@bp.route('/servizisala/<string:id_infermiere>', methods=['GET'])
def getServizioSalaByInfermiere(id_infermiere):
    repo = ServizioSalaRepository(db.session)
    print(repo)
    return repo.getServizioSalaByInfermiere(id_infermiere)

@bp.route('/serviziosala/<string:id_serviziosala>', methods=['GET'])
def getServizioSalaById(id_serviziosala):
    repo = ServizioSalaRepository(db.session)
    return repo.getServizioSalaById(id_serviziosala)


@bp.route('/serviziosala', methods=['POST'])
def createServizioSala():
    repo = ServizioSalaRepository(db.session)
    return repo.createServizioSala()


@bp.route('/serviziosala/<string:id_serviziosala>', methods=['PUT'])
def updateServizioSala(id_serviziosala):
    repo = ServizioSalaRepository(db.session)
    return repo.updateServizioSala(id_serviziosala)