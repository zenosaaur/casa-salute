from flask import Blueprint, jsonify,request
from ..repositories.pazienti_repository import PazienteRepository
from ..extensions import db

bp = Blueprint('paziente', __name__, url_prefix='/')


@bp.route('/pazienti', methods=['GET'])
def getPazienti():
    repo = PazienteRepository(db.session)
    return repo.getPazienti()

@bp.route('/pazienti/<string:id_medico>', methods=['GET'])
def getPazientiByMedico(id_medico):
    repo = PazienteRepository(db.session)
    return repo.getPazientiByMedico(id_medico)

@bp.route('/paziente/utente/<string:id_utente>', methods=['GET'])
def getPazienteByUtente(id_utente):
    repo = PazienteRepository(db.session)
    return repo.getPazienteByUtente(id_utente)

@bp.route('/medico/paziente/<string:id_paziente>', methods=['GET'])
def getMedicobyPaziente(id_paziente):
    repo = PazienteRepository(db.session)
    return repo.getMedicobyPaziente(id_paziente)

@bp.route('/paziente/<string:id_paziente>', methods=['GET'])
def getPazienteById(id_paziente):
    repo = PazienteRepository(db.session)
    return repo.getPazienteById(id_paziente)


@bp.route('/paziente/<string:id_paziente>',  methods=['POST'])
def createPazienteFromUtente(id_paziente):
    repo = PazienteRepository(db.session)
    return repo.createPazienteFromUtente(id_paziente)


@bp.route('/paziente',methods=['POST'])
def createPaziente():
    repo = PazienteRepository(db.session)
    return repo.createPaziente()


@bp.route('/paziente/<string:id_paziente>',  methods=['PUT'])
def updatePaziente(id_paziente):
    repo = PazienteRepository(db.session)
    return repo.updatePaziente(id_paziente)


