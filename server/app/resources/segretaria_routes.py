from flask import Blueprint, jsonify,request
from ..repositories.segretaria_repository import SegretariaRepository
from ..extensions import db

bp = Blueprint('segretaria', __name__, url_prefix='/')


@bp.route('/segretarie', methods=['GET'])
def getSegretaria():
    repo = SegretariaRepository(db.session)
    return repo.getSegretaria()


@bp.route('/segretaria/<string:id_segretaria>', methods=['GET'])
def getSegretariaById(id_segretaria):
    repo = SegretariaRepository(db.session)
    return repo.getSegretariaById(id_segretaria)


@bp.route('/segretaria/<string:id_segretaria>',  methods=['POST'])
def createSegretariaFromUtente(id_segretaria):
    repo = SegretariaRepository(db.session)
    return repo.createSegretariaFromUtente(id_segretaria)


@bp.route('/segretaria',  methods=['POST'])
def createSegretaria():
    repo = SegretariaRepository(db.session)
    return repo.createSegretaria()