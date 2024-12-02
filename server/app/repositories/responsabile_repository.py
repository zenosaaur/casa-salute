from flask_restful import reqparse
from ..models import utente as UtenteModel
from ..models import responsabile as ResponsabileModel
from ..models import paziente as PazienteModel
from flask_jwt_extended import jwt_required
import uuid
from sqlalchemy.orm import aliased
from sqlalchemy.sql import and_
from .base_repository import BaseRepository


class ResponsabileRepository(BaseRepository):
    def __init__(self, db_session):
        super(ResponsabileRepository,self).__init__(db_session)

    @jwt_required()
    def getResponsabili(self):    # GET
        paziente_utente = aliased(UtenteModel)
        responsabile_utente = aliased(UtenteModel)

        responsabili = self.db_session.query(
                    ResponsabileModel,
                    PazienteModel,
                    responsabile_utente,
                    paziente_utente
                ).join(
                    PazienteModel, ResponsabileModel.id_paziente == PazienteModel.id_paziente        
                ).join(
                    responsabile_utente, ResponsabileModel.id_utente == responsabile_utente.id_utente      
                ).join(
                    paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente      
                ).all()
        
        if responsabili is not None:
            responsabili_data = []
            for responsabile in responsabili:
                responsabile_dict = responsabile[0].to_dict()
                responsabile_dict['responsabile'] = responsabile[2].to_dict()
                responsabile_dict['paziente'] = responsabile[1].to_dict()
                responsabile_dict['paziente']['utente']  = responsabile[3].to_dict()
                responsabili_data.append(responsabile_dict)
        
        return (responsabili_data, 200) if responsabili else ({'message': 'Nessun responsabile trovato'}, 404)

    def getResponsabileByUtente(self,id_utente):
        paziente_utente = aliased(UtenteModel)
        responsabile_utente = aliased(UtenteModel)

        responsabili = self.db_session.query(
                    ResponsabileModel,
                    PazienteModel,
                    responsabile_utente,
                    paziente_utente
                ).join(
                    PazienteModel, ResponsabileModel.id_paziente == PazienteModel.id_paziente        
                ).join(
                    responsabile_utente, ResponsabileModel.id_utente == responsabile_utente.id_utente      
                ).join(
                    paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente      
                ).filter(
                    ResponsabileModel.id_utente == id_utente
                ).all()

        if responsabili:
                responsabili_list = []
                for responsabile in responsabili:
                    responsabile_dict = responsabile[0].to_dict()
                    responsabile_dict['responsabile'] = responsabile[2].to_dict()
                    responsabile_dict['paziente'] = responsabile[1].to_dict()
                    responsabile_dict['paziente']['utente'] = responsabile[3].to_dict()
                    responsabili_list.append(responsabile_dict)
                return (responsabili_list, 200)
        else:
            return ({'message': 'Nessun responsabile trovato'}, 404)

    @jwt_required()
    def getResponsabileById(self,id_responsabile):   # GET
        paziente_utente = aliased(UtenteModel)
        responsabile_utente = aliased(UtenteModel)

        responsabile = self.db_session.query(
                    ResponsabileModel,
                    PazienteModel,
                    responsabile_utente,
                    paziente_utente
                ).join(
                    PazienteModel, ResponsabileModel.id_paziente == PazienteModel.id_paziente        
                ).join(
                    responsabile_utente, ResponsabileModel.id_utente == responsabile_utente.id_utente      
                ).join(
                    paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente      
                ).filter(
                    ResponsabileModel.id_responsabile == id_responsabile
                ).first()
        
        if responsabile:
            responsabile_dict = responsabile[0].to_dict()
            responsabile_dict['responsabile'] = responsabile[2].to_dict()
            responsabile_dict['paziente'] = responsabile[1].to_dict()
            responsabile_dict['paziente']['utente']  = responsabile[3].to_dict()
        
        return (responsabile_dict, 200) if responsabile else ({'message': 'Nessun responsabile trovato'}, 404)
    
    @jwt_required()
    def createResponsabileFromUtente(self,id_utente):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('id_paziente', type=str, required=True)
        args = parser.parse_args()

        existing_responsabile = ResponsabileModel.query.filter_by(id_utente=id_utente, id_paziente=args['id_paziente']).first()
        if existing_responsabile:
            return {'message': 'Responsabile già esistente!'}, 409 

        try:
            responsabile = ResponsabileModel(
                id_responsabile=uuid.uuid4(),
                id_paziente = args['id_paziente'],
                id_utente=id_utente
            )

            self.db_session.add(responsabile)
            self.db_session.commit()

            return {'message': 'Responsabile creato con successo', 'id_responsabile': str(responsabile.id_responsabile)}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del responsabile: '+e}, 500
        
    @jwt_required()
    def createResponsabile(self):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('id_paziente', type=str, required=True)
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
            responsabile_id = str(uuid.uuid4())
            utente_id = str(uuid.uuid4())

            responsabile = ResponsabileModel(
                id_responsabile=responsabile_id,
                id_utente=utente_id,
                id_paziente=args['id_paziente']
            )

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

            self.db_session.add(utente)
            self.db_session.commit()
            self.db_session.add(responsabile)
            self.db_session.commit()

            return {'message': 'Responsabile e utente creati con successo', 'id_responsabile': responsabile_id}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del responsabile e utente: ' + str(e)}, 500
    
    @jwt_required()
    def updateResponsabile(self,id_responsabile):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('id_paziente', type=str, required=True)
        parser.add_argument('id_utente', type=str, required=True)
        args = parser.parse_args()

        existing_responsabile = ResponsabileModel.query.filter(and_(
                                    ResponsabileModel.id_paziente == args['id_paziente'],
                                    ResponsabileModel.id_utente == args['id_utente'],
                                    ResponsabileModel.id_responsabile != id_responsabile
                                )).first()
        if existing_responsabile:
            return {'message': 'Responsabile già esistente!'}, 409 
        
        responsabile = ResponsabileModel.query.filter_by(id_responsabile=id_responsabile).first()
        if responsabile is None:
            return {'message': 'Responsabile non presente'}, 404

        try:
            if args['id_paziente']:
                responsabile.id_paziente = args['id_paziente']
            if args['id_utente']:
                responsabile.id_utente = args['id_utente']

            self.db_session.commit()

            return {'message': 'Responsabile modificato con successo', 'id_responsabile': id_responsabile}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la modifica del responsabile: ' + str(e)}, 500


