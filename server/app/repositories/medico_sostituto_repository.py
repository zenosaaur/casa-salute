from flask_restful import reqparse
from ..models import medico as MedicoModel
from ..models import utente as UtenteModel
from ..models import medicosostituzione as MedicoSostituzioneModel
from ..models import assenza as AssenzaModel
import uuid
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import aliased
from .base_repository import BaseRepository


class MedicoSostitutoRepository(BaseRepository):
    def __init__(self, db_session):
        super(MedicoSostitutoRepository,self).__init__(db_session)

    def getMediciSostituti(self):
        medico = aliased(MedicoModel)
        medico_sostituto = aliased(MedicoModel)
        utente_medico = aliased(UtenteModel)
        utente_medico_sostituto = aliased(UtenteModel)

        mediciSostituti = self.db_session.query(
            MedicoSostituzioneModel,
            medico,
            medico_sostituto,
            utente_medico,
            utente_medico_sostituto
        ).join(
            medico, MedicoSostituzioneModel.id_medico == medico.id_medico
        ).join(
            medico_sostituto, MedicoSostituzioneModel.id_medicosostituto == medico_sostituto.id_medico
        ).join(
            utente_medico, medico.id_utente == utente_medico.id_utente
        ).join(
            utente_medico_sostituto, medico_sostituto.id_utente == utente_medico_sostituto.id_utente
        ).all()

        if mediciSostituti:
            mediciSostituti_data = []
            for medicoSostituto in mediciSostituti:
                mediciSostituti_dict=medicoSostituto[0].to_dict()
                mediciSostituti_dict['medico']=medicoSostituto[1].to_dict()
                mediciSostituti_dict['medicoSostituto']=medicoSostituto[2].to_dict()
                mediciSostituti_dict['medico']['utente']=medicoSostituto[3].to_dict()
                mediciSostituti_dict['medicoSostituto']['utente']=medicoSostituto[4].to_dict()
                mediciSostituti_data.append(mediciSostituti_dict)
            return mediciSostituti_data, 200
        else:
            return {'message': 'Nessun medico sostituto presente'}, 404
        
    def getMediciSostitutiByMedico(self,id_medico):
        medico = aliased(MedicoModel)
        medico_sostituto = aliased(MedicoModel)
        utente_medico = aliased(UtenteModel)
        utente_medico_sostituto = aliased(UtenteModel)

        mediciSostituti = self.db_session.query(
            MedicoSostituzioneModel,
            medico,
            medico_sostituto,
            utente_medico,
            utente_medico_sostituto
        ).join(
            medico, MedicoSostituzioneModel.id_medico == medico.id_medico
        ).join(
            medico_sostituto, MedicoSostituzioneModel.id_medicosostituto == medico_sostituto.id_medico
        ).join(
            utente_medico, medico.id_utente == utente_medico.id_utente
        ).join(
            utente_medico_sostituto, medico_sostituto.id_utente == utente_medico_sostituto.id_utente
        ).filter(
            MedicoSostituzioneModel.id_medico == id_medico
        ).all()

        
        if mediciSostituti:
            mediciSostituti_data = []
            for medicoSostituto in mediciSostituti:
                mediciSostituti_dict=medicoSostituto[0].to_dict()
                mediciSostituti_dict['medico']=medicoSostituto[1].to_dict()
                mediciSostituti_dict['medicoSostituto']=medicoSostituto[2].to_dict()
                mediciSostituti_dict['medico']['utente']=medicoSostituto[3].to_dict()
                mediciSostituti_dict['medicoSostituto']['utente']=medicoSostituto[4].to_dict()
                mediciSostituti_data.append(mediciSostituti_dict)
            return mediciSostituti_data, 200
        else:
            return [], 404
        
    def getMedicoByMedicoSostituto(self,id_medicosostituto):
        medico = aliased(MedicoModel)
        medico_sostituto = aliased(MedicoModel)
        utente_medico = aliased(UtenteModel)
        utente_medico_sostituto = aliased(UtenteModel)

        mediciSostituti = self.db_session.query(
            MedicoSostituzioneModel,
            medico,
            medico_sostituto,
            utente_medico,
            utente_medico_sostituto
        ).join(
            medico, MedicoSostituzioneModel.id_medico == medico.id_medico
        ).join(
            medico_sostituto, MedicoSostituzioneModel.id_medicosostituto == medico_sostituto.id_medico
        ).join(
            utente_medico, medico.id_utente == utente_medico.id_utente
        ).join(
            utente_medico_sostituto, medico_sostituto.id_utente == utente_medico_sostituto.id_utente
        ).filter(
            MedicoSostituzioneModel.id_medicosostituto == id_medicosostituto
        ).first()

        
        if mediciSostituti:
            mediciSostituti_dict=mediciSostituti[0].to_dict()
            mediciSostituti_dict['medico']=mediciSostituti[1].to_dict()
            mediciSostituti_dict['medicoSostituto']=mediciSostituti[2].to_dict()
            mediciSostituti_dict['medico']['utente']=mediciSostituti[3].to_dict()
            mediciSostituti_dict['medicoSostituto']['utente']=mediciSostituti[4].to_dict()
            return mediciSostituti_dict, 200
        else:
            return {'message': 'Nessun medico sostituto presente'}, 404
        
    def getMediciSostitutiByMedicoAndData(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id_medico', type=str, required=True)
        parser.add_argument('data', type=str, required=True)
        args = parser.parse_args()
        date = datetime.fromisoformat(args['data']).date()
        date = date.strftime('%Y-%m-%d')

        medico = aliased(MedicoModel)
        medico_sostituto = aliased(MedicoModel)
        utente_medico = aliased(UtenteModel)
        utente_medico_sostituto = aliased(UtenteModel)

        mediciSostituti = self.db_session.query(
            MedicoSostituzioneModel,
            medico,
            medico_sostituto,
            utente_medico,
            utente_medico_sostituto
        ).join(
            medico, MedicoSostituzioneModel.id_medico == medico.id_medico
        ).join(
            medico_sostituto, MedicoSostituzioneModel.id_medicosostituto == medico_sostituto.id_medico
        ).join(
            utente_medico, medico.id_utente == utente_medico.id_utente
        ).join(
            utente_medico_sostituto, medico_sostituto.id_utente == utente_medico_sostituto.id_utente
        ).filter(
            MedicoSostituzioneModel.id_medico == args['id_medico'],
            AssenzaModel.id_medico == args['id_medico'],
            AssenzaModel.data != date
        ).all()

        
        if mediciSostituti:
            mediciSostituti_data = []
            for medicoSostituto in mediciSostituti:
                mediciSostituti_dict=medicoSostituto[0].to_dict()
                mediciSostituti_dict['medico']=medicoSostituto[1].to_dict()
                mediciSostituti_dict['medicoSostituto']=medicoSostituto[2].to_dict()
                mediciSostituti_dict['medico']['utente']=medicoSostituto[3].to_dict()
                mediciSostituti_dict['medicoSostituto']['utente']=medicoSostituto[4].to_dict()
                mediciSostituti_data.append(mediciSostituti_dict)
            return mediciSostituti_data, 200
        else:
            return {'message': 'Nessun medico sostituto presente'}, 404
        
    def getMedicoSostituto(self,id_medicosostituzione):
        medico = aliased(MedicoModel)
        medico_sostituto = aliased(MedicoModel)
        utente_medico = aliased(UtenteModel)
        utente_medico_sostituto = aliased(UtenteModel)

        medicoSostituto = self.db_session.query(
            MedicoSostituzioneModel,
            medico,
            medico_sostituto,
            utente_medico,
            utente_medico_sostituto
        ).join(
            medico, MedicoSostituzioneModel.id_medico == medico.id_medico
        ).join(
            medico_sostituto, MedicoSostituzioneModel.id_medicosostituto == medico_sostituto.id_medico
        ).join(
            utente_medico, medico.id_utente == utente_medico.id_utente
        ).join(
            utente_medico_sostituto, medico_sostituto.id_utente == utente_medico_sostituto.id_utente
        ).filter(
            MedicoSostituzioneModel.id_medicosostituzione == id_medicosostituzione 
        ).first()

        if medicoSostituto:
            medicoSostituto_dict=medicoSostituto[0].to_dict()
            medicoSostituto_dict['medico']=medicoSostituto[1].to_dict()
            medicoSostituto_dict['medicoSostituto']=medicoSostituto[2].to_dict()
            medicoSostituto_dict['medico']['utente']=medicoSostituto[3].to_dict()
            medicoSostituto_dict['medicoSostituto']['utente']=medicoSostituto[4].to_dict()
            return medicoSostituto_dict, 200
        else:
            return {'message': 'Medico sostituto non trovato'}, 404
        

    def createMedicoSostituto(self):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('id_medico', type=str, required=True)
        parser.add_argument('id_medicosostituto', type=str, required=True)
        args = parser.parse_args()

        medico = MedicoModel.query.filter_by(id_medico=args['id_medico']).first()
        if not medico:
            return {'message': 'Medico non trovato'}, 404
        
        medico = MedicoModel.query.filter_by(id_medico=args['id_medicosostituto']).first()
        if not medico:
            return {'message': 'Medico non trovato'}, 404

        existing_medicoSostituto = MedicoSostituzioneModel.query.filter_by(id_medico=args['id_medico'], id_medicosostituto=args['id_medicosostituto']).first()
        if existing_medicoSostituto:
            return {'message': 'Medico sostituto già esistente!'}, 409 

        try:
            medicosostituzione_id = str(uuid.uuid4())

            medicosostituto = MedicoSostituzioneModel(
                id_medicosostituzione=medicosostituzione_id,
                id_medico=args['id_medico'],
                id_medicosostituto=args['id_medicosostituto']
            )

            self.db_session.add(medicosostituto)
            self.db_session.commit()

            return {'message': 'Medico sostituto creato con successo', 'id_medicosostituzione': medicosostituzione_id}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del medico sostituto: ' + str(e)}, 500    


    def updateMedicoSostituto(self,id_medicosostituzione):     # PUT
        parser = reqparse.RequestParser()
        parser.add_argument('id_medico', type=str, required=True)
        parser.add_argument('id_medicosostituto', type=str, required=True)
        args = parser.parse_args()

        medico = MedicoModel.query.filter_by(id_medico=args['id_medico']).first()
        if not medico:
            return {'message': 'Medico non trovato'}, 404
        
        medico = MedicoModel.query.filter_by(id_medico=args['id_medicosostituto']).first()
        if not medico:
            return {'message': 'Medico non trovato'}, 404

        existing_medicoSostituto = MedicoSostituzioneModel.query.filter_by(id_medico=args['id_medico'], id_medicosostituto=args['id_medicosostituto']).first()
        if existing_medicoSostituto:
            return {'message': 'Medico sostituto già esistente!'}, 409 
        
        medicoSostituto = MedicoSostituzioneModel.query.filter_by(id_medicosostituzione=id_medicosostituzione).first()
        if not medicoSostituto:
            return {'message': 'Medico sostituto non trovato!'}, 409 

        try:
            medicosostituto = MedicoSostituzioneModel(
                id_medicosostituzione=id_medicosostituzione,
                id_medico=args['id_medico'],
                id_medicosostituto=args['id_medicosostituto']
            )

            self.db_session.add(medicosostituto)
            self.db_session.commit()

            return {'message': 'Medico sostituto aggiornato con successo', 'id_medicosostituzione': id_medicosostituzione}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la modifica del medico sostituto: ' + str(e)}, 500    
        
