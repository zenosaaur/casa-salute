from flask import Blueprint, jsonify,request
from ..repositories.visite_repository import VisitaRepository
from ..extensions import db

bp = Blueprint('visita', __name__, url_prefix='/')



@bp.route('/visite', methods=['GET'])
def getVisite():
    repo = VisitaRepository(db.session)
    return repo.getVisite()

@bp.route('/visite/available/<string:data>', methods=['GET'])
def getAvailableTimesOnDate(data):
    repo = VisitaRepository(db.session)
    return repo.getAvailableTimesOnDate(data)

@bp.route('/visite/available/ambulatorio/<string:id_ambulatorio>', methods=['GET'])
def getAvailableTimesOnDateAndAmbulatorio(id_ambulatorio):
    repo = VisitaRepository(db.session)
    data = request.args.get('data')
    return repo.getAvailableTimesOnDateAndAmbulatorio(data, id_ambulatorio)
    

@bp.route('/visite/available/<string:data>/<string:id_medico>', methods=['GET'])
def getAvailableTimesOnDateAndMedico(data, id_medico):
    repo = VisitaRepository(db.session)
    return repo.getAvailableTimesOnDateAndMedico(data, id_medico)

@bp.route('/visite/data/<string:data>', methods=['GET'])
def getVisiteByData(data):
    repo = VisitaRepository(db.session)
    return repo.getVisiteByData(data)


@bp.route('/visite/medico/<string:id_medico>', methods=['GET'])
def getVisiteByMedico(id_medico):
    repo = VisitaRepository(db.session)
    return repo.getVisiteByMedico(id_medico)

@bp.route('/visite/medicodata/<string:id_medico>', methods=['GET']) 
def getVisiteByMedicoData(id_medico):
    repo = VisitaRepository(db.session)
    data = request.args.get('data')
    return repo.getVisiteByMedicoData(id_medico, data)

@bp.route('/visite/medicopaziente/<string:id_medico>/<string:id_paziente>', methods=['GET']) 
def getVisiteByMedicoPaziente(id_medico, id_paziente):
    repo = VisitaRepository(db.session)
    return repo.getVisiteByMedicoPaziente(id_medico, id_paziente)

@bp.route('/visite/medicopazientedata/<string:id_medico>/<string:id_paziente>', methods=['GET']) 
def getVisiteByMedicoPazienteData(id_medico, id_paziente):
    repo = VisitaRepository(db.session)
    data = request.args.get('data')
    return repo.getVisiteByMedicoPazienteData(id_medico, id_paziente, data)

@bp.route('/visita/<string:id_visita>', methods=['GET']) 

@bp.route('/visite/paziente/<string:id_utente>', methods=['GET'])
def getVisiteByUtente(id_utente):
    repo = VisitaRepository(db.session)
    return repo.getVisiteByUtente(id_utente)


@bp.route('/visita/<string:id_visita>', methods=['GET'])
def getVisitaById(id_visita):
    repo = VisitaRepository(db.session)
    return repo.getVisitaById(id_visita)


@bp.route('/visita', methods=['POST'])
def createVisita():
    repo = VisitaRepository(db.session)
    return repo.createVisita()


@bp.route('/visita/<string:id_visita>', methods=['PUT'])
def updateVisita(id_visita):
    repo = VisitaRepository(db.session)
    return repo.updateVisita(id_visita)
