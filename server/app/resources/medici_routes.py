from flask import Blueprint, jsonify,request
from ..repositories.medici_repository import MedicoRepository
from ..extensions import db

bp = Blueprint('medico', __name__, url_prefix='/')

@bp.route('/medici', methods=['GET'])
def getMedici():
    repo = MedicoRepository(db.session)
    return repo.getMedici()

@bp.route('/medicibase', methods=['GET'])
def getMediciBase():
    repo = MedicoRepository(db.session)
    return repo.getMediciBase()


@bp.route('/medico/<string:id_medico>', methods=['GET'])
def getMedicoById(id_medico):
    repo = MedicoRepository(db.session)
    return repo.getMedicoById(id_medico)


@bp.route('/medico/utente/<string:id_utente>', methods=['GET'])
def getMedicoByUtente(id_utente):
    repo = MedicoRepository(db.session)
    return repo.getMedicoByUtente(id_utente)


@bp.route('/medici/data', methods=['GET'])
def getMediciByData():
    repo = MedicoRepository(db.session)
    return repo.getMediciByData()


@bp.route('/medico/<string:id_utente>',  methods=['POST'])
def createMedicoFromUtente(id_utente):
    repo = MedicoRepository(db.session)
    return repo.createMedicoFromUtente(id_utente)


@bp.route('/medico',  methods=['POST'])
def createMedico():
    repo = MedicoRepository(db.session)
    return repo.createMedico()

@bp.route('/medicoandsostituto',  methods=['POST'])
def createMedicoAndSostituto():
    repo = MedicoRepository(db.session)
    return repo.createMedicoAndSostituto()


@bp.route('/medico/<string:id_medico>',  methods=['PUT'])
def updateMedico(id_medico):
    repo = MedicoRepository(db.session)
    return repo.updateMedico(id_medico)
