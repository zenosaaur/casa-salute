from flask_restful import reqparse
from ..models import paziente as PazienteModel
from ..models import utente as UtenteModel
from ..models import medico as MedicoModel
from ..models import responsabile as ResponsabileModel
from flask_jwt_extended import jwt_required
import uuid
from sqlalchemy.orm import aliased
from .medico_sostituto_repository import MedicoSostitutoRepository
from .base_repository import BaseRepository

class PazienteRepository(BaseRepository):
    def __init__(self, db_session):
        super(PazienteRepository,self).__init__(db_session)
        self.MedicoSostituto = MedicoSostitutoRepository(db_session)
    

    @jwt_required()
    def getPazienti(self):    # GET
        pazienti = self.db_session.query(
                        PazienteModel,
                        UtenteModel,
                        MedicoModel
                    ).join(
                        UtenteModel, PazienteModel.id_utente == UtenteModel.id_utente, isouter=True
                    ).join(
                        MedicoModel, PazienteModel.id_medico == MedicoModel.id_medico, isouter=True
                    ).all()
        
        if pazienti:
            pazienti_data = []
            
            for paziente in pazienti:
                paziente_dict = paziente[0].to_dict()
                paziente_dict["utente"] = paziente[1].to_dict()
                paziente_dict["medico"] = paziente[2]
                if paziente_dict['medico']:
                    paziente_dict['medico'] = paziente[2].to_dict()                    
                pazienti_data.append(paziente_dict)
        
        return (pazienti_data, 200) if pazienti else ({'message': 'Nessun paziente trovato'}, 404)
    
    @jwt_required()
    def getPazientiByMedico(self,id_medico):
        paziente_utente = aliased(UtenteModel)
        medico_utente = aliased(UtenteModel)

        pazienti = self.db_session.query(
                    PazienteModel,
                    paziente_utente,
                    MedicoModel,
                    medico_utente
                ).join(
                    paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
                ).join(
                    MedicoModel, PazienteModel.id_medico == MedicoModel.id_medico
                ).join(
                    medico_utente, MedicoModel.id_utente == medico_utente.id_utente
                ).filter(
                    PazienteModel.id_medico == id_medico
                ).all()
        
                        
        sostituto = self.MedicoSostituto.getMediciSostitutiByMedico(id_medico)
        if sostituto[1] == 404:   #! si tratta di un medico sostituto, altrimenti avrei dei risultati (ovvero sono il medico di base e ho dei sostituti), allora resistuisco i pazienti del medico di base + gli eventuali miei
            medico = self.MedicoSostituto.getMedicoByMedicoSostituto(id_medico)
            if(medico[1] != 404):
                print(medico)
                id_medico_base = medico[0][1].id_medico  
                pazienti_medico_base = self.db_session.query(
                                            PazienteModel,
                                            paziente_utente,
                                            MedicoModel,
                                            medico_utente
                                        ).join(
                                            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
                                        ).join(
                                            MedicoModel, PazienteModel.id_medico == MedicoModel.id_medico
                                        ).join(
                                            medico_utente, MedicoModel.id_utente == medico_utente.id_utente
                                        ).filter(
                                            PazienteModel.id_medico == id_medico_base
                                        ).all()  
                pazienti = pazienti + pazienti_medico_base

        if pazienti:
            pazienti_data = []
            for paziente in pazienti:
                paziente_dict = paziente[0].to_dict()
                paziente_dict['utente'] = paziente[1].to_dict()
                paziente_dict['medico'] = paziente[2].to_dict()
                paziente_dict['medico']['utente'] = paziente[3].to_dict()                
                pazienti_data.append(paziente_dict)
            return pazienti_data, 200
        else:
            return {'message': 'Nessun paziente associato al medico fornito'}, 404

    @jwt_required()
    def getMedicobyPaziente(self,id_paziente):
        paziente_utente = aliased(UtenteModel)
        medico_utente = aliased(UtenteModel)

        # Query to get the medico associated with the given paziente
        result = self.db_session.query(
                MedicoModel,
                medico_utente
            ).join(
                PazienteModel, PazienteModel.id_medico == MedicoModel.id_medico
            ).join(
                medico_utente, MedicoModel.id_utente == medico_utente.id_utente
            ).filter(
                PazienteModel.id_paziente == id_paziente
            ).first()

        # Check if a corresponding medico was found
        if result:
            medico, medico_utente_info = result
            medico_dict = medico.to_dict()
            medico_dict['utente'] = medico_utente_info.to_dict()
            return medico_dict, 200
        else:
            return {'message': 'Medico non trovato'}, 404
    
    @jwt_required()
    def getPazienteById(self,id_paziente):
        paziente = self.db_session.query(
                        PazienteModel,
                        UtenteModel,
                        MedicoModel
                    ).join(
                        UtenteModel, PazienteModel.id_utente == UtenteModel.id_utente, isouter=True
                    ).join(
                        MedicoModel, PazienteModel.id_medico == MedicoModel.id_medico, isouter=True
                    ).filter(
                        PazienteModel.id_paziente == id_paziente
                    ).first()

        if paziente:
            paziente_dict = paziente[0].to_dict()
            paziente_dict['utente'] = paziente[1].to_dict()
            paziente_dict['medico'] = paziente[2]
            if paziente_dict['medico'] is not None:
                paziente_dict['medico'] = paziente[2].to_dict()
            return paziente_dict,200
        else:
            return {'message': 'Paziente non trovato'}, 404
    
    @jwt_required()   
    def getPazienteByUtente(self,id_utente):
        paziente = self.db_session.query(
                        PazienteModel,
                        UtenteModel,
                        MedicoModel
                    ).join(
                        UtenteModel, PazienteModel.id_utente == UtenteModel.id_utente, isouter=True
                    ).join(
                        MedicoModel, PazienteModel.id_medico == MedicoModel.id_medico, isouter=True
                    ).filter(
                        PazienteModel.id_utente == id_utente
                    ).first()

        if paziente:
            paziente_dict = paziente[0].to_dict()
            paziente_dict['utente'] = paziente[1].to_dict()
            paziente_dict['medico'] = paziente[2]
            if paziente_dict['medico'] is not None:
                paziente_dict['medico'] = paziente[2].to_dict()
            return paziente_dict
        else:
            return {'message': 'Paziente non trovato'}, 404
        
    @jwt_required()
    def createPazienteFromUtente(self,id_utente):
        parser = reqparse.RequestParser()
        parser.add_argument('codicesanitario', type=int, required=True)
        args = parser.parse_args()

        existing_paziente = PazienteModel.query.filter_by(id_utente=id_utente).first()
        if existing_paziente:
            return {'message': 'Paziente già esistente!'}, 409 
        
        try:
            paziente = PazienteModel(
                id_paziente=uuid.uuid4(),
                id_utente=id_utente,
                codicesanitario=args['codicesanitario']
            )

            self.db_session.add(paziente)
            self.db_session.commit()

            return {'message': 'Paziente creato con successo', 'id_paziente': str(paziente.id_paziente)}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del paziente: '+e}, 500

    @jwt_required()
    def createPaziente(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id_medico', type=str, required=True)
        parser.add_argument('codicesanitario', type=int, required=True)
        parser.add_argument('nome', type=str, required=True)
        parser.add_argument('cognome', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        parser.add_argument('codicefiscale', type=str, required=True)
        parser.add_argument('data', type=str, required=True)
        parser.add_argument('luogonascita', type=str, required=True)

        parser.add_argument('nome_resp', type=str, required=False)
        parser.add_argument('cognome_resp', type=str, required=False)
        parser.add_argument('codicefiscale_resp', type=str, required=False)
        parser.add_argument('data_resp', type=str, required=False)
        parser.add_argument('luogonascita_resp', type=str, required=False)
        args = parser.parse_args()

        

        existing_utente = UtenteModel.query.filter_by(email=args['email']).first()
        if existing_utente:
            return {'message': 'Utente già esistente!'}, 409 
        
        try:
            paziente_id = str(uuid.uuid4())
            utente_id = str(uuid.uuid4())
            
            if args['nome_resp']:
                responsabile_id = str(uuid.uuid4())
                responsabile_utente_id = str(uuid.uuid4())
                responsabile = UtenteModel(
                    id_utente=responsabile_id,
                    nome=args['nome_resp'],
                    cognome=args['cognome_resp'],
                    email=args['email'],
                    password=args['password'],
                    codicefiscale=args['codicefiscale_resp'],
                    data=args['data_resp'],
                    luogonascita=args['luogonascita_resp']
                )

                self.db_session.add(responsabile)

                utente = UtenteModel(
                    id_utente=utente_id,
                    nome=args['nome'],
                    cognome=args['cognome'],
                    codicefiscale=args['codicefiscale'],
                    data=args['data'],
                    luogonascita=args['luogonascita']
                )
                self.db_session.add(utente)
                self.db_session.commit()
            else:
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

            paziente = PazienteModel(
                id_paziente=paziente_id,
                id_utente=utente_id,
                id_medico=args['id_medico'],
                codicesanitario=args['codicesanitario']
            )

            self.db_session.add(paziente)
            self.db_session.commit()

            if args['nome_resp']:
                link = ResponsabileModel(
                    id_responsabile = responsabile_utente_id,
                    id_utente = responsabile_id,
                    id_paziente = paziente_id
                )
                self.db_session.add(link)
                self.db_session.commit()
            
            return {'message': 'Paziente e utente creati con successo', 'id_paziente': paziente_id}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del paziente e utente: ' + str(e)}, 500

    @jwt_required()
    def updatePaziente(self,id_paziente):     # PUT
        parser = reqparse.RequestParser()
        parser.add_argument('codicesanitario', type=int, required=True)
        parser.add_argument('id_medico', type=str, required=False)
        args = parser.parse_args()

        paziente = PazienteModel.query.filter_by(id_paziente=id_paziente).first()
        if not paziente:
            return {'message': 'Paziente non trovato'}, 404

        try:
            if args['codicesanitario']:
                paziente.codicesanitario = args['codicesanitario']
            if args['id_medico']:
                paziente.id_medico = args['id_medico']

            self.db_session.commit()

            return {'message': 'Paziente aggiornato con successo', 'id_paziente': id_paziente}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante l\'aggiornamento del paziente: '+e}, 500


