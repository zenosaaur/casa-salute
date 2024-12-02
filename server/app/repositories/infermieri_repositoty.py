from flask_restful import reqparse
from ..models import infermiere as InfermiereModel
from ..models import utente as UtenteModel
from flask_jwt_extended import jwt_required
import uuid
from .base_repository import BaseRepository

class InfermiereRepository(BaseRepository):
    def __init__(self, db_session):
      super(InfermiereRepository,self).__init__(db_session)

    @jwt_required()
    def getInfermieri(self):    # GET
        infermieri = self.db_session.query(
                    InfermiereModel,
                    UtenteModel
                ).join(
                    UtenteModel, InfermiereModel.id_utente == UtenteModel.id_utente        
                ).all()
        
        if infermieri is not None:
            infermieri_data = []
            for infermiere in infermieri:
                infermiere_dict = infermiere.infermiere.to_dict()
                infermiere_dict['utente'] = infermiere.utente.to_dict()
                infermieri_data.append(infermiere_dict)
        
        return (infermieri_data, 200) if infermieri else ({'message': 'Nessun infermiere trovato'}, 404)

    @jwt_required()
    def getInfermiereById(self,id_infermiere):   # GET
        infermiere = self.db_session.query(
                    InfermiereModel,
                    UtenteModel
                ).join(
                    UtenteModel, InfermiereModel.id_utente == UtenteModel.id_utente        
                ).filter(
                    InfermiereModel.id_infermiere == id_infermiere
                ).first()

        if infermiere:
            infermiere_dict = infermiere[0].to_dict()
            infermiere_dict['utente'] = infermiere[1].to_dict()
            return infermiere_dict, 200
        else:
            return {'message': 'Infermiere non trovato'}, 404
        

    @jwt_required()
    def getInfermiereByUtente(self,id_utente):   # GET
        infermiere = self.db_session.query(
                    InfermiereModel,
                    UtenteModel
                ).join(
                    UtenteModel, InfermiereModel.id_utente == UtenteModel.id_utente        
                ).filter(
                    InfermiereModel.id_utente == id_utente
                ).first()

        if infermiere:
            infermiere_dict = infermiere[0].to_dict()
            infermiere_dict['utente'] = infermiere[1].to_dict()
            return infermiere_dict, 200
        else:
            return {'message': 'Infermiere non trovato'}, 404
    
    @jwt_required()
    def createInfermiereFromUtente(self,id_utente):     # POST

        existing_infermiere = InfermiereModel.query.filter_by(id_utente=id_utente).first()
        if existing_infermiere:
            return {'message': 'Infermiere già esistente!'}, 409 

        try:
            infermiere = InfermiereModel(
                id_infermiere=uuid.uuid4(),
                id_utente=id_utente
            )

            self.db_session.add(infermiere)
            self.db_session.commit()

            return {'message': 'Infermiere creato con successo', 'id_infermiere': str(infermiere.id_infermiere)}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione dell\'infermiere: '+e}, 500
        
    @jwt_required()
    def createInfermiere(self):     # POST
        parser = reqparse.RequestParser()
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
            infermiere_id = str(uuid.uuid4())
            utente_id = str(uuid.uuid4())

            infermiere = InfermiereModel(
                id_infermiere=infermiere_id,
                id_utente=utente_id,
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
            self.db_session.add(infermiere)
            self.db_session.commit()

            return {'message': 'Infermiere e utente creati con successo', 'id_infermiere': infermiere_id}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione dell\'infermiere e utente: ' + str(e)}, 500
    