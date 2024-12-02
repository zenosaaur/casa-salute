from flask import Blueprint, jsonify,request
from ..repositories.tipo_ambulatorio_repository import TipoAmbulatorioRepository
from ..extensions import db

bp = Blueprint('tipoambulatorio', __name__, url_prefix='/')


@bp.route('/tipiambulatorio', methods=['GET'])
def getTipiAmbulatorio():
    repo = TipoAmbulatorioRepository(db.session)
    return repo.getTipiAmbulatorio()


@bp.route('/tipoambulatorio/<string:id_tipoambulatorio>', methods=['GET'])
def getTipoAmbulatorioById(id_tipoambulatorio):
    repo = TipoAmbulatorioRepository(db.session)
    return repo.getTipoAmbulatorioById(id_tipoambulatorio)

@bp.route('/tipoambulatorio/medico/<string:id_medico>', methods=['GET'])
def getTipoAmbulatorioByIdMedico(id_medico):
    repo = TipoAmbulatorioRepository(db.session)
    return repo.getTipoAmbulatorioByIdMedico(id_medico)


@bp.route('/tipoambulatorio', methods=['POST'])
def createTipoAmbulatorio():
    repo = TipoAmbulatorioRepository(db.session)
    return repo.createTipoAmbulatorio()


@bp.route('/tipoambulatorio/<string:id_tipoambulatorio>', methods=['PUT'])
def updateTipoAmbulatorio(id_tipoambulatorio):
    repo = TipoAmbulatorioRepository(db.session)
    return repo.updateTipoAmbulatorio(id_tipoambulatorio)