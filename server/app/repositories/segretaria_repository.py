from flask_restful import reqparse
from ..models import segretaria as SegretariaModel
from ..models import utente as UtenteModel
from flask_jwt_extended import jwt_required
import uuid
from .base_repository import BaseRepository


class SegretariaRepository(BaseRepository):
    def __init__(self, db_session):
        super(SegretariaRepository,self).__init__(db_session)

    @jwt_required()
    def getSegretaria(self):    # GET
        segretarie = self.db_session.query(
                    SegretariaModel,
                    UtenteModel
                ).join(
                    UtenteModel, SegretariaModel.id_utente == UtenteModel.id_utente        
                ).all()
        
        if segretarie is not None:
            segretarie_data = []
            for segretaria in segretarie:
                segretarie_dict = segretaria.segretaria.to_dict()
                segretarie_dict['utente'] = segretaria.utente.to_dict()
                segretarie_data.append(segretarie_dict)
        
        return (segretarie_data, 200) if segretarie else ({'message': 'Nessuna segretaria trovato'}, 404)

    @jwt_required()
    def getSegretariaById(self,id_segretaria):   # GET
        segretaria = self.db_session.query(
                    SegretariaModel,
                    UtenteModel
                ).join(
                    UtenteModel, SegretariaModel.id_utente == UtenteModel.id_utente        
                ).filter(
                    SegretariaModel.id_segretaria == id_segretaria
                ).first()

        if segretaria:
            segretaria_dict = segretaria[0].to_dict()
            segretaria_dict['utente'] = segretaria[1].to_dict()
            return segretaria_dict, 200
        else:
            return {'message': 'Segretaria non trovato'}, 404
    
    @jwt_required()
    def createSegretariaFromUtente(self,id_utente):     # POST

        existing_segretaria = SegretariaModel.query.filter_by(id_utente=id_utente).first()
        if existing_segretaria:
            return {'message': 'Segretaria già esistente!'}, 409 

        try:
            segretaria = SegretariaModel(
                id_segretaria=uuid.uuid4(),
                id_utente=id_utente
            )

            self.db_session.add(segretaria)
            self.db_session.commit()

            return {'message': 'Segretaria creato con successo', 'id_segretaria': str(segretaria.id_segretaria)}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione della segretaria: '+e}, 500
        
    @jwt_required()
    def createSegretaria(self):     # POST
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
            segretaria_id = str(uuid.uuid4())
            utente_id = str(uuid.uuid4())

            segretaria = SegretariaModel(
                id_segretaria=segretaria_id,
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
            self.db_session.add(segretaria)
            self.db_session.commit()

            return {'message': 'Segretaria e utente creati con successo', 'id_segretaria': segretaria_id}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione della segretaria e utente: ' + str(e)}, 500
    
    # la put non serve, basta modificare l'utente


