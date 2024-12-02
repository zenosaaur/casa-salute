from flask import Blueprint, jsonify
from ..repositories.assenze_repository import AssenzaRepository
from ..extensions import db

bp = Blueprint('assenza', __name__, url_prefix='/')

@bp.route('/assenze', methods=['GET'])
def getAssenze():
    repo = AssenzaRepository(db.session)
    return repo.getAssenze()


@bp.route('/assenza/<string:id_assenza>', methods=['GET'])
def getAssenzaById(id_assenza):
    repo = AssenzaRepository(db.session)
    return repo.getAssenzaById(id_assenza)

@bp.route('/assenze/<string:id_medico>', methods=['GET']) 
def getAssenzaByMedico(id_medico):
    repo = AssenzaRepository(db.session)
    return repo.getAssenzaByMedico(id_medico)

@bp.route('/assenze/<string:id_medico>/<string:date>', methods=['GET']) 
def getAssenzaByMedicoDate(id_medico,date):
    repo = AssenzaRepository(db.session)
    return repo.getAssenzaByMedicoDate(id_medico,date)

@bp.route('/assenza', methods=['POST']) 
def createAssenza():
    repo = AssenzaRepository(db.session)
    return repo.createAssenza()


@bp.route('/assenza/<string:id_assenza>', methods=['PUT'])
def updateAssenza(id_assenza):
    repo = AssenzaRepository(db.session)
    return repo.updateAssenza(id_assenza)
