from flask_restful import reqparse
from ..models import tipovisita as TipoVisitaModel
import uuid
from flask_jwt_extended import jwt_required
from .base_repository import BaseRepository


class TipoVisitaRepository(BaseRepository):
    def __init__(self, db_session):
        super(TipoVisitaRepository,self).__init__(db_session)
        self.db_session = db_session

    
    @jwt_required()
    def getTipiVisita(self):    # GET
        tipivisita = TipoVisitaModel.query.all()
        return ([tipovisita.to_dict() for tipovisita in tipivisita], 200) if tipivisita else ({'message': 'Nessun tipo di visita trovato'}, 404)

    @jwt_required()
    def getTipoVisitaById(self,id_tipovisita):   # GET
        tipovisita = TipoVisitaModel.query.filter_by(id_tipovisita=id_tipovisita).first()
        return (tipovisita.to_dict(), 200) if tipovisita else ({'message': 'Tipo di visita non trovato'}, 404)
    
    @jwt_required()
    def createTipoVisita(self):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('tipo', type=str, required=True)
        args = parser.parse_args()

        existing_tipovisita = TipoVisitaModel.query.filter_by(tipo=args['tipo']).first()
        if existing_tipovisita:
            return {'message': 'Tipo di visita già presente!'}, 409 

        try:
            tipovisita = TipoVisitaModel(
                id_tipovisita=uuid.uuid4(),
                tipo=args['tipo'],
            )

            self.db_session.add(tipovisita)
            self.db_session.commit()

            return {'message': 'Tipo di visita creato con successo', 'id_tipovisita': str(tipovisita.id_tipovisita)}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del tipo di visita: '+str(e)}, 500
    
    @jwt_required()
    def updateTipoVisita(self,id_tipovisita):     # PUT
        parser = reqparse.RequestParser()
        parser.add_argument('tipo', type=str, required=True)
        args = parser.parse_args()

        tipovisita = TipoVisitaModel.query.filter_by(id_tipovisita=id_tipovisita).first()
        if not tipovisita:
            return {'message': 'Tipo di visita non trovato'}, 404

        try:
            if args['tipo']:
                tipovisita.tipo = args['tipo']

            self.db_session.commit()

            return {'message': 'Tipo di visita aggiornato con successo', 'id_tipovisita': id_tipovisita}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante l\'aggiornamento del tipo di visita: '+str(e)}, 500
