from flask import Blueprint, jsonify,request
from ..repositories.prelievi_medicazioni_repository import PrelieviMedicazioniRepository
from ..extensions import db


bp = Blueprint('prelievimedicazioni', __name__, url_prefix='/')


@bp.route('/prelievimedicazioni', methods=['GET'])
def getPrelieviMedicazioni():
    repo = PrelieviMedicazioniRepository(db.session)
    return repo.getPrelieviMedicazioni()

@bp.route('/prelievimedicazioni/available/tiposala/<string:id_tiposala>', methods=['GET'])
def getAvailableTimesOnDateAndTipoSala(id_tiposala):
    repo = PrelieviMedicazioniRepository(db.session)
    data = request.args.get('data')
    return repo.getAvailableTimesOnDateAndTipoSala(data, id_tiposala)


@bp.route('/prelievimedicazioni/<string:data>', methods=['GET'])
def getPrelieviMedicazioniByData(data):
    repo = PrelieviMedicazioniRepository(db.session)
    return repo.getPrelieviMedicazioniByData(data)

@bp.route('/prelievimedicazioni/infermiere/<string:id_infermiere>', methods=['GET'])
def getPrelieviMedicazioniByInfermiere(id_infermiere):
    repo = PrelieviMedicazioniRepository(db.session)
    return repo.getPrelieviMedicazioniByInfermiere(id_infermiere)

@bp.route('/prelievimedicazioni/infermieredata/<string:id_infermiere>', methods=['GET'])
def getPrelieviMedicazioniByInfermiereData(id_infermiere):
    repo = PrelieviMedicazioniRepository(db.session)
    data = request.args.get('data')
    return repo.getPrelieviMedicazioniByInfermiereData(id_infermiere, data)


@bp.route('/prelievomedicazione/<string:id_prelievimedicazioni>', methods=['GET'])
def getPrelievoMedicazioneById(id_prelievimedicazioni):
    repo = PrelieviMedicazioniRepository(db.session)
    return repo.getPrelievoMedicazioneById(id_prelievimedicazioni)


@bp.route('/prelievimedicazioni/utente/<string:id_utente>', methods=['GET'])
def getPrelieviMedicazioniByUtente(id_utente):
    repo = PrelieviMedicazioniRepository(db.session)
    return repo.getPrelievoMedicazioneByUtente(id_utente)


@bp.route('/prelievomedicazione', methods=['POST'])
def createPrelievoMedicazione():
    repo = PrelieviMedicazioniRepository(db.session)
    return repo.createPrelievoMedicazione()


@bp.route('/prelievomedicazione/<string:id_prelievimedicazioni>', methods=['PUT'])
def updatePrelievoMedicazione(id_prelievimedicazioni):
    repo = PrelieviMedicazioniRepository(db.session)
    return repo.updatePrelievoMedicazione(id_prelievimedicazioni)