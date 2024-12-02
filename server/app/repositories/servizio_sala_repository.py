from flask_restful import reqparse
from ..models import utente as UtenteModel
from ..models import serviziosala as ServizioSalaModel
from ..models import infermiere as InfermiereModel
from ..models import tiposala as TipoSalaModel
import uuid
from flask_jwt_extended import jwt_required
from datetime import datetime, timedelta, time as datetime_time
from .base_repository import BaseRepository


class ServizioSalaRepository(BaseRepository):
    def __init__(self, db_session):
        super(ServizioSalaRepository,self).__init__(db_session)
   
    @jwt_required()
    def getServiziSala(self):
        servizisala = self.db_session.query(
            ServizioSalaModel,
            InfermiereModel,
            UtenteModel
        ).join(
            InfermiereModel, ServizioSalaModel.id_infermiere == InfermiereModel.id_infermiere
        ).join(
            UtenteModel, InfermiereModel.id_utente == UtenteModel.id_utente
        ).all()

        if servizisala:
            servizisala_data = []
            for serviziosala in servizisala:
                serviziosala_dict=serviziosala[0].to_dict()
                serviziosala_dict['infermiere']=serviziosala[1].to_dict()
                serviziosala_dict['infermiere']['utente']=serviziosala[2].to_dict()
                servizisala_data.append(serviziosala_dict)
            return servizisala_data, 200
        else:
            return {'message': 'Nessun servizio sala trovato'}, 404
        

    @jwt_required()
    def getServizioSalaByInfermiere(self,id_infermiere):
        servizisala = self.db_session.query(
            ServizioSalaModel,
            InfermiereModel,
            UtenteModel,
            TipoSalaModel
        ).join(
            InfermiereModel, ServizioSalaModel.id_infermiere == InfermiereModel.id_infermiere
        ).join(
            UtenteModel, InfermiereModel.id_utente == UtenteModel.id_utente
        ).join(
            TipoSalaModel, TipoSalaModel.id_tiposala == ServizioSalaModel.sala
        ).filter(
            ServizioSalaModel.id_infermiere == id_infermiere
        ).all()
        if servizisala:
            servizisala_data = []
            for serviziosala in servizisala:
                serviziosala_dict=serviziosala[0].to_dict()
                serviziosala_dict['infermiere']=serviziosala[1].to_dict()
                serviziosala_dict['infermiere']['utente']=serviziosala[2].to_dict()
                serviziosala_dict['sala']=serviziosala[3].to_dict()
                servizisala_data.append(serviziosala_dict)
                
            return servizisala_data, 200
        else:
            return [], 200
        

    @jwt_required()
    def getServizioSalaById(self,id_serviziosala):
        serviziosala = self.db_session.query(
            ServizioSalaModel,
            InfermiereModel,
            UtenteModel
        ).join(
            InfermiereModel, ServizioSalaModel.id_infermiere == InfermiereModel.id_infermiere
        ).join(
            UtenteModel, InfermiereModel.id_utente == UtenteModel.id_utente
        ).filter(
            ServizioSalaModel.id_serviziosala == id_serviziosala
        ).first()

        if serviziosala:
            serviziosala_dict=serviziosala[0].to_dict()
            serviziosala_dict['infermiere']=serviziosala[1].to_dict()
            serviziosala_dict['infermiere']['utente']=serviziosala[2].to_dict()
            
            return serviziosala_dict, 200
        else:
            {'message': 'Servizio sala non trovato'}, 404

    @jwt_required()
    def createServizioSala(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id_infermiere', type=str, required=True)
        parser.add_argument('data', type=str, required=True)
        parser.add_argument('sala', type=str, required=True)
        args = parser.parse_args()
        print(args)

        date = datetime.strptime(args['data'], "%Y-%m-%dT%H:%M:%S.%fZ")
        if date.weekday() > 4:
            return {"message": "La casa salute è chiusa nel giorno proposto"}, 409

        sala = TipoSalaModel.query.filter_by(id_tiposala=args['sala']).first()
        if not sala:
            return {'message': 'Sala non trovata'}, 404

        infemriere = InfermiereModel.query.filter_by(id_infermiere=args['id_infermiere']).first()
        if not infemriere:
            return {'message': 'Infermiere non trovato'}, 404

        serviziosala = ServizioSalaModel.query.filter_by(id_infermiere=args['id_infermiere'], data=args['data'], sala=args['sala']).first()
        if serviziosala:
            return {'message': 'Servizio sala già presente'}, 409
        
        try:
            serviziosala_id = str(uuid.uuid4())

            serviziosala = ServizioSalaModel(
                id_serviziosala = serviziosala_id,
                id_infermiere = args['id_infermiere'],
                data = args['data'],
                sala = args['sala']
            )

            self.db_session.add(serviziosala)
            self.db_session.commit()

            return {'message': 'Servizio sala creato con successo', 'id_serviziosala': serviziosala_id}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del servizio sala: ' + str(e)}, 500
        
    @jwt_required()
    def updateServizioSala(self, id_serviziosala):
        parser = reqparse.RequestParser()
        parser.add_argument('id_infermiere', type=str, required=True)
        parser.add_argument('data', type=str, required=True)
        parser.add_argument('sala', type=str, required=True)
        args = parser.parse_args()

        try:
            date = datetime.strptime(args['data'], "%Y-%m-%dT%H:%M:%S.%fZ")
        except ValueError:
            return {"message": "Data non valida"}, 400

        if date.weekday() > 4:
            return {"message": "La casa salute è chiusa nel giorno proposto"}, 409
        
        sala = TipoSalaModel.query.filter_by(id_tiposala=args['sala']).first()
        if not sala:
            return {'message': 'Sala non trovata'}, 404

        infermiere = InfermiereModel.query.filter_by(id_infermiere=args['id_infermiere']).first()
        if not infermiere:
            return {'message': 'Infermiere non trovato'}, 404

        serviziosala = ServizioSalaModel.query.filter_by(id_serviziosala=id_serviziosala).first()
        if not serviziosala:
            return {'message': 'Servizio sala non trovato'}, 404

        existing_serviziosala = ServizioSalaModel.query.filter_by(id_infermiere=args['id_infermiere'], data=date, sala=args['sala']).first()
        if existing_serviziosala and existing_serviziosala.id_serviziosala != id_serviziosala:
            return {'message': 'Servizio sala già presente'}, 409

        try:
            serviziosala.id_infermiere = args['id_infermiere']
            serviziosala.data = date  # Store as datetime
            serviziosala.sala = args['sala']

            self.db_session.commit()

            return {'message': 'Servizio sala aggiornato con successo', 'id_serviziosala': id_serviziosala}, 200
        except Exception as e:
            self.db_session.rollback()
            return {'message': f"Errore durante l'aggiornamento del servizio sala: {str(e)}"}, 500
        
