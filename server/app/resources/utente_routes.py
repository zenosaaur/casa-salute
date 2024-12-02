from flask import Blueprint, jsonify, request
from ..repositories.utente_repository import UtenteRepository
from ..extensions import db

bp = Blueprint('utente', __name__, url_prefix='/')


@bp.route('/login', methods=['POST'])
def login():
    repo = UtenteRepository(db.session)
    return repo.login()

# UTENTE -----------------------------------------------


@bp.route('/utenti', methods=['GET'])
def getUtenti():
    repo = UtenteRepository(db.session)
    return repo.getUtenti()


@bp.route('/utente/<string:id_utente>', methods=['GET'])
def getUtenteById(id_utente):
    repo = UtenteRepository(db.session)
    return repo.getUtenteById(id_utente)


@bp.route('/utente',  methods=['POST'])
def createUtente():
    repo = UtenteRepository(db.session)
    return repo.createUtente()


@bp.route('/utente/<string:id_utente>',  methods=['PUT'])
def updateUtente(id_utente):
    repo = UtenteRepository(db.session)
    return repo.updateUtente(id_utente)
