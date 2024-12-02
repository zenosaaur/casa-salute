from flask import Blueprint, jsonify,request
from ..repositories.infermieri_repositoty import InfermiereRepository
from ..extensions import db

bp = Blueprint('infermiere', __name__, url_prefix='/')


@bp.route('/infermieri', methods=['GET'])
def getInfermieri():
    repo = InfermiereRepository(db.session)
    return repo.getInfermieri()

@bp.route('/infermiere/utente/<string:id_utente>', methods=['GET'])
def getInfermiereByUtente(id_utente):
    repo = InfermiereRepository(db.session)
    return repo.getInfermiereByUtente(id_utente)

@bp.route('/infermiere/<string:id_infermiere>', methods=['GET'])
def getInfermiereById(id_infermiere):
    repo = InfermiereRepository(db.session)
    return repo.getInfermiereById(id_infermiere)


@bp.route('/infermiere/<string:id_infermiere>',  methods=['POST'])
def createInfermiereFromUtente(id_infermiere):
    repo = InfermiereRepository(db.session)
    return repo.createInfermiereFromUtente(id_infermiere)


@bp.route('/infermiere',  methods=['POST'])
def createInfermiere():
    repo = InfermiereRepository(db.session)
    return repo.createInfermiere()