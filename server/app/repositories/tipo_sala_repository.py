from flask_restful import reqparse
from ..models import tiposala as TipoSalaModel
import uuid
from flask_jwt_extended import jwt_required
from .base_repository import BaseRepository


class TipoSalaRepository(BaseRepository):
    def __init__(self, db_session):
        super(TipoSalaRepository,self).__init__(db_session)
        self.db_session = db_session

    
    @jwt_required()
    def getTipiSala(self):    # GET
        tipisala = TipoSalaModel.query.all()
        return ([tiposala.to_dict() for tiposala in tipisala], 200) if tipisala else ({'message': 'Nessun tipo di sala trovato'}, 404)

    @jwt_required()
    def getTipoSalaById(id_tiposala):   # GET
        tiposala = TipoSalaModel.query.filter_by(id_tiposala=id_tiposala).first()
        return (tiposala.to_dict(), 200) if tiposala else ({'message': 'Tipo di sala non trovato'}, 404)
    
    @jwt_required()
    def createTipoSala(self):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('tipo', type=str, required=True)
        args = parser.parse_args()

        existing_tiposala = TipoSalaModel.query.filter_by(tipo=args['tipo']).first()
        if existing_tiposala:
            return {'message': 'Tipo di sala già presente!'}, 409 

        try:
            tiposala = TipoSalaModel(
                id_tiposala=uuid.uuid4(),
                tipo=args['tipo'],
            )

            self.db_session.add(tiposala)
            self.db_session.commit()

            return {'message': 'Tipo di sala creato con successo', 'id_tiposala': str(tiposala.id_tiposala)}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del tipo di sala: '+str(e)}, 500
    
    @jwt_required()
    def updateTipoSala(self, id_tiposala):     # PUT
        parser = reqparse.RequestParser()
        parser.add_argument('tipo', type=str, required=True)
        args = parser.parse_args()

        tiposala = TipoSalaModel.query.filter_by(id_tiposala=id_tiposala).first()
        if not tiposala:
            return {'message': 'Tipo di sala non trovato'}, 404

        try:
            if args['tipo']:
                tiposala.tipo = args['tipo']

            self.db_session.commit()

            return {'message': 'Tipo di sala aggiornato con successo', 'id_tiposala': id_tiposala}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante l\'aggiornamento del tipo di sala: '+str(e)}, 500
