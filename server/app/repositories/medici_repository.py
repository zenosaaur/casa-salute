from flask_restful import reqparse
from ..models import medico as MedicoModel
from ..models import utente as UtenteModel
from ..models import assenza as AssenzaModel
from ..models import medicosostituzione as MedicoSostituzioneModel
from ..models import tipoambulatorio as TipoAmbulatorioModel
import uuid
from flask_jwt_extended import jwt_required
from flask import jsonify
from flask_jwt_extended import create_access_token
from .base_repository import BaseRepository


class MedicoRepository(BaseRepository):
    def __init__(self, db_session):
        super(MedicoRepository,self).__init__(db_session)

    def getMedici(self):    # GET
        medici = self.db_session.query(
                    MedicoModel,
                    UtenteModel
                ).join(
                    UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente        
                ).all()

        if medici is not None:
            medici_data = []
            for medico in medici:
                medico_dict = medico.medico.to_dict()
                medico_dict['utente'] = medico.utente.to_dict()
                medici_data.append(medico_dict)
        
        return (medici_data, 200) if medici else ({'message': 'Nessun medico trovato'}, 404)
    
    @jwt_required()
    def getMediciBase(self):    # GET
        medici = self.db_session.query(
                    MedicoModel,
                    UtenteModel,
                    TipoAmbulatorioModel
                ).join(
                    UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente        
                ).join(
                    TipoAmbulatorioModel, TipoAmbulatorioModel.id_medico == MedicoModel.id_medico
                ).all()
        
        if medici is not None:
            medici_data = []
            for medico in medici:
                medico_dict = medico.medico.to_dict()
                medico_dict['utente'] = medico.utente.to_dict()
                medici_data.append(medico_dict)
        
        return (medici_data, 200) if medici else ({'message': 'Nessun medico trovato'}, 404)

    @jwt_required()
    def getMedicoById(self,id_medico):   # GET
        medico = self.db_session.query(
                    MedicoModel,
                    UtenteModel
                ).join(
                    UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente        
                ).filter(
                    MedicoModel.id_medico == id_medico
                ).first()

        if medico:
            medico_dict = medico[0].to_dict()
            medico_dict['utente'] = medico[1].to_dict()
            return medico_dict, 200
        else:
            return {'message': 'Medico non trovato'}, 404
        


    @jwt_required()
    def getMedicoByUtente(self,id_utente):
        medico = self.db_session.query(
                    MedicoModel,
                    UtenteModel
                ).join(
                    UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente        
                ).filter(
                    MedicoModel.id_utente == id_utente
                ).first()
        
        if medico:
            medico_dict = medico[0].to_dict()
            medico_dict['utente'] = medico[1].to_dict()
            return medico_dict, 200
        else:
            return {'message': 'Medico non trovato'}, 404


    @jwt_required()
    def getMediciByData(self):   # GET
        medici = self.db_session.query(
                    MedicoModel,
                    UtenteModel
                ).join(
                    UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente        
                ).outerjoin(
                    AssenzaModel, MedicoModel.id_medico == AssenzaModel.id_medico
                ).filter(
                    AssenzaModel.id_medico == None
                ).all()
        
        if medici is not None:
            medici_data = []
            for medico in medici:
                medico_dict = medico.medico.to_dict()
                medico_dict['utente'] = medico.utente.to_dict()
                medici_data.append(medico_dict)
            
        
        return (medici_data, 200) if medici else ({'message': 'Tutti i medici sono assenti'}, 404)
    
    @jwt_required()
    def createMedicoFromUtente(self,id_utente):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('specializzazione', type=str, required=True)
        args = parser.parse_args()

        existing_medico = MedicoModel.query.filter_by(id_utente=id_utente).first()
        if existing_medico:
            return {'message': 'Medico già esistente!'}, 409 

        try:
            medico = MedicoModel(
                id_medico=uuid.uuid4(),
                id_utente=id_utente,
                specializzazione=args['specializzazione']
            )

            self.db_session.add(medico)
            self.db_session.commit()

            return {'message': 'Medico creato con successo', 'id_medico': str(medico.id_medico)}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del medico: '+e}, 500
        
    @jwt_required()
    def createMedico(self):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('specializzazione', type=str, required=True)
        parser.add_argument('nome', type=str, required=True)
        parser.add_argument('cognome', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        parser.add_argument('codicefiscale', type=str, required=True)
        parser.add_argument('data', type=str, required=True)
        parser.add_argument('luogonascita', type=str, required=True)
        args = parser.parse_args()

        existing_utente = UtenteModel.query.filter_by(email=args['email']).first()
        if existing_utente:
            return {'message': 'Utente già esistente!'}, 409 

        try:
            medico_id = str(uuid.uuid4())
            utente_id = str(uuid.uuid4())

            utente = UtenteModel(
                id_utente=utente_id,
                nome=args['nome'],
                cognome=args['cognome'],
                email=args['email'],
                password=args['password'],
                codicefiscale=args['codicefiscale'],
                data=args['data'],
                luogonascita=args['luogonascita']
            )

            medico = MedicoModel(
                id_medico=medico_id,
                id_utente=utente_id,
                specializzazione=args['specializzazione']
            )


            self.db_session.add(utente)
            self.db_session.commit()
            self.db_session.add(medico)
            self.db_session.commit()

            return {'message': 'Medico e utente creati con successo', 'id_medico': medico_id}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del medico e utente: ' + str(e)}, 500
        
    @jwt_required()
    def createMedicoAndSostituto(self):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('specializzazione', type=str, required=True)
        parser.add_argument('nome', type=str, required=True)
        parser.add_argument('cognome', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        parser.add_argument('codicefiscale', type=str, required=True)
        parser.add_argument('data', type=str, required=True)
        parser.add_argument('luogonascita', type=str, required=True)
        parser.add_argument('id_medicosostituto', type=str, required=True)
        args = parser.parse_args()

        existing_utente = UtenteModel.query.filter_by(email=args['email']).first()
        if existing_utente:
            return {'message': 'Utente già esistente!'}, 404
        
        medicosostituto = MedicoModel.query.filter_by(id_medico=args['id_medicosostituto']).first()
        if not medicosostituto:
            return {'message': 'Medico indicato non presente'}, 404

        try:
            medico_id = str(uuid.uuid4())
            utente_id = str(uuid.uuid4())
            medicosostituzione_id = str(uuid.uuid4())

            utente = UtenteModel(
                id_utente=utente_id,
                nome=args['nome'],
                cognome=args['cognome'],
                email=args['email'],
                password=args['password'],
                codicefiscale=args['codicefiscale'],
                data=args['data'],
                luogonascita=args['luogonascita']
            )

            medico = MedicoModel(
                id_medico=medico_id,
                id_utente=utente_id,
                specializzazione=args['specializzazione']
            )

            medicosostituto = MedicoSostituzioneModel(
                id_medicosostituzione=medicosostituzione_id,
                id_medico=args['id_medicosostituto'],
                id_medicosostituto=medico_id
            )


            try:
                with self.db_session.begin_nested():  # Start a savepoint
                    self.db_session.add(utente)
                    self.db_session.flush()  # Ensure utente is added but not committed yet

                    self.db_session.add(medico)
                    self.db_session.add(medicosostituto)
                    self.db_session.commit()
                    

                return {'message': 'Medico e utente creati con successo', 'id_medico': medico_id}, 200
            except Exception as e:
                print(e)
                self.db_session.rollback()
                return {'message': 'Errore durante la creazione del medico sostituto: ' + str(e)}, 500
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del medico e utente: ' + str(e)}, 500
    
    @jwt_required()
    def updateMedico(self,id_medico):     # PUT
        parser = reqparse.RequestParser()
        parser.add_argument('specializzazione', type=str, required=True)
        args = parser.parse_args()

        medico = MedicoModel.query.filter_by(id_medico=id_medico).first()
        if not medico:
            return {'message': 'Medico non trovato'}, 404

        try:
            if args['specializzazione']:
                medico.specializzazione = args['specializzazione']

            self.db_session.commit()

            return {'message': 'Medico aggiornato con successo', 'id_medico': id_medico}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante l\'aggiornamento del medico: '+e}, 500
