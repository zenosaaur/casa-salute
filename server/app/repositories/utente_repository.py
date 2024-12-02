from flask_restful import reqparse
from ..models import utente as UtenteModel
from ..models import medico as MedicoModel
from ..models import paziente as PazienteModel
from ..models import infermiere as InfermiereModel
from ..models import segretaria as SegretariaModel
from ..models import responsabile as ResponsabileModel
import uuid
from flask_jwt_extended import jwt_required
from flask_jwt_extended import create_access_token
from .base_repository import BaseRepository


class UtenteRepository(BaseRepository):
    def __init__(self, db_session):
        super(UtenteRepository, self).__init__(db_session)
        self.db_session = db_session

    @jwt_required()
    def getUtenti(self):    # GET
        utenti = UtenteModel.query.all()
        return ([utente.to_dict() for utente in utenti], 200) if utenti else ({'message': 'Nessun utente trovato'}, 404)

    @jwt_required()
    def getUtenteById(self, id_utente):   # GET
        utente = UtenteModel.query.filter_by(id_utente=id_utente).first()
        return (utente.to_dict(), 200) if utente else ({'message': 'Utente non trovato'}, 404)

    @jwt_required()
    def createUtente(self):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('nome', type=str, required=True)
        parser.add_argument('cognome', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        parser.add_argument('codicefiscale', type=str, required=True)
        parser.add_argument('data', type=str, required=True)
        parser.add_argument('luogonascita', type=str, required=True)
        args = parser.parse_args()

        existing_user = UtenteModel.query.filter_by(
            email=args['email']).first()
        if existing_user:
            return {'message': 'Utente già presente!'}, 409

        try:
            utente = UtenteModel(
                id_utente=uuid.uuid4(),
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

            return {'message': 'Utente creato con successo', 'id_utente': str(utente.id_utente)}, 200
        except Exception as e:
            self.db_session.rollback()
            return {'message': 'Errore durante la creazione dell\'utente: '+str(e)}, 500

    @jwt_required()
    def updateUtente(self, id_utente):     # PUT
        parser = reqparse.RequestParser()
        parser.add_argument('nome', type=str, required=True)
        parser.add_argument('cognome', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        parser.add_argument('codicefiscale', type=str, required=True)
        parser.add_argument('data', type=str, required=True)
        parser.add_argument('luogonascita', type=str, required=True)
        args = parser.parse_args()

        utente = UtenteModel.query.filter_by(id_utente=id_utente).first()
        if not utente:
            return {'message': 'Utente non trovato'}, 404

        try:
            if args['nome']:
                utente.nome = args['nome']
            if args['cognome']:
                utente.cognome = args['cognome']
            if args['email']:
                existing_user = UtenteModel.query.filter_by(
                    email=args['email']).first()
                if existing_user:
                    return {'message': 'Email già in uso da un altro utente'}, 409
                utente.email = args['email']
            if args['password']:
                utente.password = args['password']
            if args['codicefiscale']:
                utente.codicefiscale = args['codicefiscale']
            if args['data']:
                utente.data = args['data']
            if args['luogonascita']:
                utente.luogonascita = args['luogonascita']

            self.db_session.commit()

            return {'message': 'Utente aggiornato con successo', 'id_utente': id_utente}, 200
        except Exception as e:
            self.db_session.rollback()
            return {'message': 'Errore durante l\'aggiornamento dell\'utente: '+str(e)}, 500

    def login(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('email', type=str, required=True)
            parser.add_argument('password', type=str, required=True)
            args = parser.parse_args()
            email = args['email']
            password = args['password']

            utente = UtenteModel.query.filter_by(
                email=email, password=password).first()
            if utente is None:
                return {"message": "Credenziali non valide"}, 401
            token = create_access_token(identity=email)

            role = None
            if MedicoModel.query.filter_by(id_utente=utente.id_utente).first():
                role = "medico"
            elif ResponsabileModel.query.filter_by(id_utente=utente.id_utente).first():
                role = "responsabile"
            elif PazienteModel.query.filter_by(id_utente=utente.id_utente).first():
                role = "paziente"
            elif InfermiereModel.query.filter_by(id_utente=utente.id_utente).first():
                role = "infermiere"
            elif SegretariaModel.query.filter_by(id_utente=utente.id_utente).first():
                role = "segretaria"
            # , "utente": utente.to_dict()
            return {"token": token, "utente": str(utente.id_utente), "ruolo": role}, 200

        except Exception as e:
            return {'message': f'Error: {str(e)}'}, 500
