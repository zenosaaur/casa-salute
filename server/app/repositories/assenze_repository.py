from flask_restful import reqparse
from ..models import medico as MedicoModel
from ..models import utente as UtenteModel
from ..models import assenza as AssenzaModel
import uuid
from flask_jwt_extended import jwt_required
from datetime import datetime, timedelta, time as datetime_time
from .base_repository import BaseRepository

class AssenzaRepository(BaseRepository):
    def __init__(self, db_session):
        super(AssenzaRepository,self).__init__(db_session)
    
    @jwt_required()
    def getAssenze(self):
        assenze = self.db_session.query(
            AssenzaModel,   
            MedicoModel,
            UtenteModel
        ).join(
            MedicoModel, AssenzaModel.id_medico == MedicoModel.id_medico
        ).join(
            UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente
        ).all()
        if assenze:
            assenze_data = []
            for assenza in assenze:
                assenza_dict=assenza[0].to_dict()
                assenza_dict['medico']=assenza[1].to_dict()
                assenza_dict['medico']['utente']=assenza[2].to_dict()
                assenze_data.append(assenza_dict)
            return assenze_data, 200
        else:
            return {'message', 'Nessuna assenza trovata'}, 404
        
    @jwt_required()
    def getAssenzaById(self,id_assenza):
        assenza = self.db_session.query(
            AssenzaModel,
            MedicoModel,
            UtenteModel
        ).join(
            MedicoModel, AssenzaModel.id_medico == MedicoModel.id_medico
        ).join(
            UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente
        ).filter(
            AssenzaModel.id_assenza == id_assenza
        ).first()

        if assenza:
            assenza_dict=assenza[0].to_dict()
            assenza_dict['medico']=assenza[1].to_dict()
            assenza_dict['medico']['utente']=assenza[2].to_dict()
            
            return assenza_dict, 200
        else:
            {'message', 'Assenza non trovato'}, 404

    @jwt_required()
    def getAssenzaByMedico(self,id_medico):
        assenze = None
        if(id_medico):
            assenze = self.db_session.query(
                AssenzaModel,
                MedicoModel,
                UtenteModel
            ).join(
                MedicoModel, AssenzaModel.id_medico == MedicoModel.id_medico
            ).join(
                UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente
            ).filter(
                AssenzaModel.id_medico == id_medico
            ).all()
        if len(assenze)>0:
            assenze_data = []
            for assenza in assenze:
                assenza_dict=assenza[0].to_dict()
                assenza_dict['medico']=assenza[1].to_dict()
                assenza_dict['medico']['utente']=assenza[2].to_dict()
                assenze_data.append(assenza_dict)
            return assenze_data, 200
        else:
            return {'message': 'Nessuna assenza trovata'}, 404
        
    @jwt_required()
    def getAssenzaByMedicoDate(self,id_medico, date):
        date = datetime.fromisoformat(date).date()
        date = date.strftime('%Y-%m-%d')
        assenza = self.db_session.query(
            AssenzaModel,
            MedicoModel,
            UtenteModel
        ).join(
            MedicoModel, AssenzaModel.id_medico == MedicoModel.id_medico
        ).join(
            UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente
        ).filter(
            AssenzaModel.id_medico == id_medico, 
            AssenzaModel.data == date
        ).first()


        if assenza:
            assenza_dict=assenza[0].to_dict()
            assenza_dict['medico']=assenza[1].to_dict()
            assenza_dict['medico']['utente']=assenza[2].to_dict()
            
            return assenza_dict, 200
        else:
            return [], 404


    @jwt_required()
    def createAssenza(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id_medico', type=str, required=True)
        parser.add_argument('data', type=str, required=True)
        args = parser.parse_args()

        try:
            date = datetime.strptime(args['data'], "%Y-%m-%dT%H:%M:%S.%fZ")
        except ValueError:
            return {"message": "Data non valida"}, 400

        if date.weekday() > 4:
            return {"message": "La casa salute è chiusa nel giorno proposto"}, 409

        medico = MedicoModel.query.filter_by(id_medico=args['id_medico']).first()
        if not medico:
            return {'message': 'Medico non trovato'}, 404

        # Query the database using datetime format
        assenza = AssenzaModel.query.filter_by(id_medico=args['id_medico'], data=date).first()
        if assenza:
            return {'message': 'Assenza già presente'}, 409
        
        try:
            assenza_id = str(uuid.uuid4())

            assenza = AssenzaModel(
                id_assenza=assenza_id,
                id_medico=args['id_medico'],
                data=date  # Store as datetime
            )

            self.db_session.add(assenza)
            self.db_session.commit()

            return {'message': 'Assenza creata con successo', 'id_assenza': assenza_id}, 200
        except Exception as e:
            self.db_session.rollback()
            return {'message': f"Errore durante la creazione dell'assenza: {str(e)}"}, 500
        
    @jwt_required()
    def updateAssenza(self, id_assenza):
        parser = reqparse.RequestParser()
        parser.add_argument('id_medico', type=str, required=True)
        parser.add_argument('data', type=str, required=True)
        args = parser.parse_args()

        try:
            date = datetime.strptime(args['data'], "%Y-%m-%dT%H:%M:%S.%fZ")
        except ValueError:
            return {"message": "Data non valida"}, 400

        if date.weekday() > 4:
            return {"message": "La casa salute è chiusa nel giorno proposto"}, 409

        medico = MedicoModel.query.filter_by(id_medico=args['id_medico']).first()
        if not medico:
            return {'message': 'Medico non trovato'}, 404

        assenza = AssenzaModel.query.filter_by(id_assenza=id_assenza).first()
        if not assenza:
            return {'message': 'Assenza non trovata'}, 404

        # Check if the new date is already taken
        existing_assenza = AssenzaModel.query.filter_by(id_medico=args['id_medico'], data=date).first()
        if existing_assenza and existing_assenza.id_assenza != id_assenza:
            return {'message': 'Assenza già presente'}, 409

        try:
            assenza.id_medico = args['id_medico']
            assenza.data = date  # Store as datetime

            self.db_session.commit()

            return {'message': 'Assenza aggiornata con successo', 'id_assenza': id_assenza}, 200
        except Exception as e:
            self.db_session.rollback()
            return {'message': f"Errore durante l'aggiornamento dell'assenza: {str(e)}"}, 500
        