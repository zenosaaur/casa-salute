from flask import Blueprint, jsonify,request
from ..repositories.responsabile_repository import ResponsabileRepository
from ..extensions import db

bp = Blueprint('responsabile', __name__, url_prefix='/')

@bp.route('/responsabili', methods=['GET'])
def getResponsabili():
    repo = ResponsabileRepository(db.session)
    return repo.getResponsabili()

@bp.route('/responsabile/<string:id_responsabile>', methods=['GET'])
def getResponsabileById(id_responsabile):
    repo = ResponsabileRepository(db.session)
    return repo.getResponsabileById(id_responsabile)

@bp.route('/responsabile/utente/<string:id_utente>', methods=['GET'])
def getResponsabileByUtente(id_utente):
    repo = ResponsabileRepository(db.session)    
    return repo.getResponsabileByUtente(id_utente)

@bp.route('/responsabile', methods=['POST'])
def createResponsabile():
    repo = ResponsabileRepository(db.session)  
    return repo.createResponsabile()


@bp.route('/responsabile/<string:id_utente>',  methods=['POST'])
def createResponsabileFromUtente(id_utente):
    repo = ResponsabileRepository(db.session) 
    return repo.createResponsabileFromUtente(id_utente)


@bp.route('/responsabile/<string:id_responsabile>', methods=['PUT'])
def updateResponsabile(id_responsabile):
    repo = ResponsabileRepository(db.session) 
    return repo.updateResponsabile(id_responsabile)