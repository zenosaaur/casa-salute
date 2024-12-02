from flask import Blueprint, jsonify,request
from ..repositories.medico_sostituto_repository import MedicoSostitutoRepository
from ..extensions import db

bp = Blueprint('medicosostituto', __name__, url_prefix='/')


@bp.route('/medicisostituti', methods=['GET'])
def getMediciSostituti():
    repo = MedicoSostitutoRepository(db.session)
    return repo.getMediciSostituti()


@bp.route('/medicisostituti/<string:id_medico>', methods=['GET'])
def getMediciSostitutiByMedico(id_medico):
    repo = MedicoSostitutoRepository(db.session)
    return repo.getMediciSostitutiByMedico(id_medico)


@bp.route('/medicosostituto/<string:id_medicosostituzione>', methods=['GET'])
def getMedicoSostituto(id_medicosostituzione):
    repo = MedicoSostitutoRepository(db.session)
    return repo.getMedicoSostituto(id_medicosostituzione)


@bp.route('/medicisostituti/medicodata', methods=['POST'])
def getMediciSostitutiByMedicoAndData():
    repo = MedicoSostitutoRepository(db.session)
    return repo.getMediciSostitutiByMedicoAndData()


@bp.route('/medicosostituto', methods=['POST'])
def createMedicoSostituto():
    repo = MedicoSostitutoRepository(db.session)
    return repo.createMedicoSostituto()


@bp.route('/medicosostituto/<string:id_medicosostituzione>', methods=['PUT'])
def updateMedicoSostituto(id_medicosostituzione):
    repo = MedicoSostitutoRepository(db.session)
    return repo.updateMedicoSostituto(id_medicosostituzione)



