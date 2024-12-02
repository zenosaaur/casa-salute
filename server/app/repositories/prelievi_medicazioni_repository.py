from flask_restful import reqparse
from ..models import prelievimedicazioni as PrelievoMedicazioneModel
from ..models import paziente as PazienteModel
from ..models import infermiere as InfermiereModel
from ..models import utente as UtenteModel
from ..models import serviziosala as ServizioSalaModel
from ..models import tiposala as TipoSalaModel
import uuid
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import aliased
from datetime import datetime, timedelta, time as datetime_time
from sqlalchemy import String, and_, cast, func
import random
from .base_repository import BaseRepository


class PrelieviMedicazioniRepository(BaseRepository):
    def __init__(self, db_session):
        super(PrelieviMedicazioniRepository,self).__init__(db_session)
        self.valid_times = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', 
                            '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
                            '15:00', '15:30', '16:00', '16:30']
    
    @jwt_required()
    def getPrelieviMedicazioni(self):
        paziente_utente = aliased(UtenteModel)
        infermiere_utente = aliased(UtenteModel)

        prelievimedicazioni = (
            self.db_session.query(
                PrelievoMedicazioneModel,
                PazienteModel,
                InfermiereModel,
                paziente_utente,
                infermiere_utente,
                TipoSalaModel
            )
            .join(
                PazienteModel,
                PrelievoMedicazioneModel.id_paziente == PazienteModel.id_paziente,
            )
            .join(
                InfermiereModel,
                PrelievoMedicazioneModel.id_infermiere == InfermiereModel.id_infermiere,
            )
            .join(paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente)
            .join(
                infermiere_utente,
                InfermiereModel.id_utente == infermiere_utente.id_utente,
            ).join(
                TipoSalaModel, TipoSalaModel.id_tiposala == PrelievoMedicazioneModel.id_tiposala
            )
            .all()
        )

        if prelievimedicazioni:
            prelievi_data = []
            medicazioni_data = []
            for prelievomedicazione in prelievimedicazioni:
                prelievomedicazione_dict = prelievomedicazione[0].to_dict()
                prelievomedicazione_dict["infermiere"] = prelievomedicazione[2].to_dict()
                prelievomedicazione_dict["paziente"] = prelievomedicazione[1].to_dict()
                prelievomedicazione_dict["infermiere"]["utente"] = prelievomedicazione[4].to_dict()
                prelievomedicazione_dict["paziente"]["utente"] = prelievomedicazione[3].to_dict()
                prelievomedicazione_dict["tiposala"] = prelievomedicazione[5].to_dict()
                if prelievomedicazione[5].to_dict()['tipo'] == 'Prelievi':
                    prelievi_data.append(prelievomedicazione_dict)
                elif prelievomedicazione[5].to_dict()['tipo'] == 'Medicazioni':
                    medicazioni_data.append(prelievomedicazione_dict)
            response = {
                "prelievi": prelievi_data,
                "medicazioni": medicazioni_data
            }
            return response, 200
        else:
            return {"message": "Nessun prelievo o medicazione trovata"}, 404
        

    @jwt_required()
    def getPrelieviMedicazioniByInfermiere(self,id_infermiere):
        paziente_utente = aliased(UtenteModel)
        infermiere_utente = aliased(UtenteModel)

        medicazioni = self.db_session.query(
            PrelievoMedicazioneModel,
            PazienteModel,
            InfermiereModel,
            paziente_utente,
            infermiere_utente,
            TipoSalaModel
        ).join(
            PazienteModel, PrelievoMedicazioneModel.id_paziente == PazienteModel.id_paziente
        ).join(
            InfermiereModel, PrelievoMedicazioneModel.id_infermiere == InfermiereModel.id_infermiere
        ).join(
            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
        ).join(
            infermiere_utente, InfermiereModel.id_utente == infermiere_utente.id_utente
        ).join(
            TipoSalaModel, TipoSalaModel.id_tiposala == PrelievoMedicazioneModel.id_tiposala
        ).filter(
            PrelievoMedicazioneModel.id_infermiere == id_infermiere
        ).order_by(
            PrelievoMedicazioneModel.datainizio
        ).all()
        
        if medicazioni:
            medicazioni_data = []
            prelievi_data = []
            for medicazione in medicazioni:
                medicazione_dict=medicazione[0].to_dict()
                medicazione_dict['infermiere']=medicazione[2].to_dict()
                medicazione_dict['paziente']=medicazione[1].to_dict()
                medicazione_dict['infermiere']['utente']=medicazione[4].to_dict()
                medicazione_dict['paziente']['utente']=medicazione[3].to_dict()
                medicazione_dict["tiposala"] = medicazione[5].to_dict()
                if medicazione[5].to_dict()['tipo'] == 'Prelievi':
                    prelievi_data.append(medicazione_dict)
                elif medicazione[5].to_dict()['tipo'] == 'Medicazioni':
                    medicazioni_data.append(medicazione_dict)
            response = {
                "prelievi": prelievi_data,
                "medicazioni": medicazioni_data
            }
            return response, 200
        else:
            return {'message': 'Nessuna medicazione/prelievo trovato.'}, 404
        
    @jwt_required()
    def getPrelieviMedicazioniByInfermiereData(self,id_infermiere, data):
        data = datetime.fromisoformat(data).date()
        data = data.strftime('%Y-%m-%d')

        paziente_utente = aliased(UtenteModel)
        infermiere_utente = aliased(UtenteModel)

        medicazioni = self.db_session.query(
            PrelievoMedicazioneModel,
            PazienteModel,
            InfermiereModel,
            paziente_utente,
            infermiere_utente,
            TipoSalaModel
        ).join(
            PazienteModel, PrelievoMedicazioneModel.id_paziente == PazienteModel.id_paziente
        ).join(
            InfermiereModel, PrelievoMedicazioneModel.id_infermiere == InfermiereModel.id_infermiere
        ).join(
            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
        ).join(
            infermiere_utente, InfermiereModel.id_utente == infermiere_utente.id_utente
        ).join(
            TipoSalaModel, TipoSalaModel.id_tiposala == PrelievoMedicazioneModel.id_tiposala
        ).filter(
            PrelievoMedicazioneModel.id_infermiere == id_infermiere,
            cast(PrelievoMedicazioneModel.datainizio, String).like(f'{data}%')
        ).order_by(
            PrelievoMedicazioneModel.datainizio
        ).all()
        
        if medicazioni:
            medicazioni_data = []
            prelievi_data = []
            for medicazione in medicazioni:
                medicazione_dict=medicazione[0].to_dict()
                medicazione_dict['infermiere']=medicazione[2].to_dict()
                medicazione_dict['paziente']=medicazione[1].to_dict()
                medicazione_dict['infermiere']['utente']=medicazione[4].to_dict()
                medicazione_dict['paziente']['utente']=medicazione[3].to_dict()
                medicazione_dict["tiposala"] = medicazione[5].to_dict()
                if medicazione[5].to_dict()['tipo'] == 'Prelievi':
                    prelievi_data.append(medicazione_dict)
                elif medicazione[5].to_dict()['tipo'] == 'Medicazioni':
                    medicazioni_data.append(medicazione_dict)
            response = {
                "prelievi": prelievi_data,
                "medicazioni": medicazioni_data
            }
            return response, 200
        else:
            return {'message': 'Nessuna medicazione/prelievo trovato.'}, 404

    def __getVisiteTimesByDataAndTipoSala(self,data, id_tiposala):
        data = datetime.fromisoformat(data).date()
        data = data.strftime('%Y-%m-%d')

        premed = self.db_session.query(
            PrelievoMedicazioneModel,
            TipoSalaModel
        ).join(
            TipoSalaModel, TipoSalaModel.id_tiposala == id_tiposala
        ).filter(
            cast(PrelievoMedicazioneModel.datainizio, String).like(f'{data}%')
        ).order_by(
            PrelievoMedicazioneModel.datainizio
        ).all()

        if premed:
            visite_data = []
            for visita in premed:
                visita_dict = visita[0].to_dict()
                visita_dict['tiposala']=visita[1].to_dict()
                visite_data.append(visita_dict)
            return visite_data, 200
        else:
            return [], 200
        

    def getAvailableTimesOnDateAndTipoSala(self,data, id_tiposala):
        print(data)
        if(not data):
            return self.valid_times, 200
        
        premed = self.__getVisiteTimesByDataAndTipoSala(data, id_tiposala)[0]
        booked_times = [datetime.strptime(visita['datainizio'], '%Y-%m-%d %H:%M').strftime('%H:%M') for visita in premed]
        available_times = [time for time in self.valid_times if time not in booked_times]

        return available_times, 200

    @jwt_required()
    def getPrelieviMedicazioniByData(self,data):
        data = datetime.fromisoformat(data).date()
        data = data.strftime('%Y-%m-%d')

        paziente_utente = aliased(UtenteModel)
        infermiere_utente = aliased(UtenteModel)

        prelievimedicazioni = (
            self.db_session.query(
                PrelievoMedicazioneModel,
                PazienteModel,
                InfermiereModel,
                paziente_utente,
                infermiere_utente,
                TipoSalaModel
            )
            .join(
                PazienteModel,
                PrelievoMedicazioneModel.id_paziente == PazienteModel.id_paziente,
            )
            .join(
                InfermiereModel,
                PrelievoMedicazioneModel.id_infermiere == InfermiereModel.id_infermiere,
            )
            .join(paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente)
            .join(
                infermiere_utente,
                InfermiereModel.id_utente == infermiere_utente.id_utente,
            ).join(
                TipoSalaModel, TipoSalaModel.id_tiposala == PrelievoMedicazioneModel.id_tiposala
            )
            .filter(cast(PrelievoMedicazioneModel.datainizio, String).like(f'{data}%'))
            .order_by(
                PrelievoMedicazioneModel.datainizio
            )
            .all()
        )

        if prelievimedicazioni:
            medicazioni_data = []
            prelievi_data = []
            for medicazione in prelievimedicazioni:
                medicazione_dict=medicazione[0].to_dict()
                medicazione_dict['infermiere']=medicazione[2].to_dict()
                medicazione_dict['paziente']=medicazione[1].to_dict()
                medicazione_dict['infermiere']['utente']=medicazione[4].to_dict()
                medicazione_dict['paziente']['utente']=medicazione[3].to_dict()
                medicazione_dict["tiposala"] = medicazione[5].to_dict()
                if medicazione[5].to_dict()['tipo'] == 'Prelievi':
                    prelievi_data.append(medicazione_dict)
                elif medicazione[5].to_dict()['tipo'] == 'Medicazioni':
                    medicazioni_data.append(medicazione_dict)
            response = {
                "prelievi": prelievi_data,
                "medicazioni": medicazioni_data
            }
            return response, 200
        else:
            return {'message': 'Nessuna medicazione/prelievo trovato.'}, 404

    @jwt_required()
    def getPrelievoMedicazioneById(self,id_prelievimedicazioni):
        paziente_utente = aliased(UtenteModel)
        infermiere_utente = aliased(UtenteModel)

        prelievimedicazioni = (
            self.db_session.query(
                PrelievoMedicazioneModel,
                PazienteModel,
                InfermiereModel,
                paziente_utente,
                infermiere_utente,
                TipoSalaModel
            )
            .join(
                PazienteModel,
                PrelievoMedicazioneModel.id_paziente == PazienteModel.id_paziente,
            )
            .join(
                InfermiereModel,
                PrelievoMedicazioneModel.id_infermiere == InfermiereModel.id_infermiere,
            )
            .join(paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente)
            .join(
                infermiere_utente,
                InfermiereModel.id_utente == infermiere_utente.id_utente,
            ).join(
                TipoSalaModel, TipoSalaModel.id_tiposala == PrelievoMedicazioneModel.id_tiposala
            )
            .filter(
                PrelievoMedicazioneModel.id_prelievimedicazioni
                == id_prelievimedicazioni
            )
            .first()
        )

        if prelievimedicazioni:
            prelievimedicazioni_data = []
            for prelievomedicazione in prelievimedicazioni:
                prelievomedicazione_dict = prelievomedicazione[0].to_dict()
                prelievomedicazione_dict["infermiere"] = prelievomedicazione[2].to_dict()
                prelievomedicazione_dict["paziente"] = prelievomedicazione[1].to_dict()
                prelievomedicazione_dict["infermiere"]["utente"] = prelievomedicazione[4].to_dict()
                prelievomedicazione_dict["paziente"]["utente"] = prelievomedicazione[3].to_dict()
                prelievomedicazione_dict["tiposala"] = prelievomedicazione[5].to_dict()
                prelievimedicazioni_data.append(prelievomedicazione_dict)
            return prelievimedicazioni_data, 200
        else:
            return [], 200

    @jwt_required()
    def getPrelievoMedicazioneByUtente(self,id_utente):
        paziente_utente = aliased(UtenteModel)
        infermiere_utente = aliased(UtenteModel)
        prelievimedicazioni = (
            self.db_session.query(
                PrelievoMedicazioneModel,
                PazienteModel,
                InfermiereModel,
                paziente_utente,
                infermiere_utente,
                TipoSalaModel
            )
            .join(
                PazienteModel,
                PrelievoMedicazioneModel.id_paziente == PazienteModel.id_paziente,
            )
            .join(
                InfermiereModel,
                PrelievoMedicazioneModel.id_infermiere == InfermiereModel.id_infermiere,
            )
            .join(paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente)
            .join(
                infermiere_utente,
                InfermiereModel.id_utente == infermiere_utente.id_utente,
            ).join(
                TipoSalaModel, TipoSalaModel.id_tiposala == PrelievoMedicazioneModel.id_tiposala
            )
            .filter(
                PazienteModel.id_utente == id_utente
            ).all()
        )

        if prelievimedicazioni:
            prelievimedicazioni_data = []
            for prelievomedicazione in prelievimedicazioni:
                prelievomedicazione_dict = prelievomedicazione[0].to_dict()
                prelievomedicazione_dict["infermiere"] = prelievomedicazione[2].to_dict()
                prelievomedicazione_dict["paziente"] = prelievomedicazione[1].to_dict()
                prelievomedicazione_dict["infermiere"]["utente"] = prelievomedicazione[4].to_dict()
                prelievomedicazione_dict["paziente"]["utente"] = prelievomedicazione[3].to_dict()
                prelievomedicazione_dict["tiposala"] = prelievomedicazione[5].to_dict()
                prelievimedicazioni_data.append(prelievomedicazione_dict)
            return prelievimedicazioni_data, 200
        else:
            return [], 200

    @ jwt_required()
    def createPrelievoMedicazione(self):  # POST
        parser = reqparse.RequestParser()
        parser.add_argument("id_paziente", type=str, required=True)
        parser.add_argument("id_infermiere", type=str, required=True)
        parser.add_argument("datainizio", type=str, required=True)
        parser.add_argument("esito", type=str, required=False)
        parser.add_argument("note", type=str, required=False)
        parser.add_argument("id_tiposala", type=str, required=True)
        args = parser.parse_args()

        d = datetime.strptime(args['datainizio'], "%Y-%m-%dT%H:%M:%S.%fZ")
        data = d.date()

        print(args["datainizio"])

        if not args['id_infermiere'] or args["datainizio"] == "":
            args['id_infermiere'] = self.__getInfermiereBySalaAndData(d, data, args['id_tiposala'])
        if args['id_infermiere'] == 'no infermieri':
            return {"message": "Non ci sono infermieri disponibili in quel giorno e in quella sala"}, 404

        d = datetime.strptime(args['datainizio'], "%Y-%m-%dT%H:%M:%S.%fZ")
        if d.weekday() > 4:
            return {"message": "La casa salute è chiusa nel giorno proposto"}, 409

        time = d.time()
        if time < datetime_time(8,0) or time > datetime_time(17,0):
            return {"message": "La casa salute è chiusa nell'orario proposto"}, 409
        
        date = d.date()
        d_time = datetime.combine(date, datetime_time(0,0,0))
        servizio = ServizioSalaModel.query.filter_by(
            id_infermiere=args['id_infermiere'],
            data=d_time
        ).first()
        if not servizio:
            return {"message": "L'infermiere indicato non è in servizio quel giorno"}, 404

        tiposala = TipoSalaModel.query.filter_by(
            id_tiposala=args['id_tiposala']
        ).first()
        if not tiposala:
            return {"message": "Tiposala non esiste"}, 404

        infermiere = InfermiereModel.query.filter_by(
            id_infermiere=args["id_infermiere"]
        ).first()
        if not infermiere:
            return {"message": "Infermiere non trovato"}, 404
        
        infSala = self.db_session.query(
                InfermiereModel,
                TipoSalaModel,
                ServizioSalaModel
            ).join(
                ServizioSalaModel, InfermiereModel.id_infermiere == ServizioSalaModel.id_infermiere
            ).join(
                TipoSalaModel, TipoSalaModel.id_tiposala == ServizioSalaModel.sala
            ).filter(
                InfermiereModel.id_infermiere == args['id_infermiere'],  # Filtro per l'id dell'infermiere
                TipoSalaModel.id_tiposala == args['id_tiposala'],  # Filtro per l'id del tipo sala
                cast(ServizioSalaModel.data, String).like(f'{data}%')  # Filtro per la data di inizio servizio
            ).first()
        if not infSala:
            return {"message": "L'infermiere non è disponibile nella sala richiesta il giorno specificato"}, 404
        

        paziente = PazienteModel.query.filter_by(
            id_paziente=args["id_paziente"]
        ).first()
        if not paziente:
            return {"message": "Paziente non trovato"}, 404

        existing_prelievomedicazione = PrelievoMedicazioneModel.query.filter_by(
            id_paziente=args["id_paziente"],
            id_infermiere=args["id_infermiere"],
            datainizio=args["datainizio"],
        ).first()
        if existing_prelievomedicazione:
            return {"message": "Prelievo o medicazione già esistente!"}, 409
        
        busy_infermiere = PrelievoMedicazioneModel.query.filter_by(
            id_infermiere=args["id_infermiere"],
            datainizio=args["datainizio"]
        ).first()
        if busy_infermiere:
            return {"message": "Infermiere occupato, cambia l'orario!"}, 409

        try:
            prelievomedicazione_id = str(uuid.uuid4())

            prelievomedicazione = PrelievoMedicazioneModel(
                id_prelievimedicazioni=prelievomedicazione_id,
                id_infermiere=args["id_infermiere"],
                id_paziente=args["id_paziente"],
                datainizio=args["datainizio"],
                esito=args["esito"],
                note=args["note"],
                id_tiposala=args['id_tiposala']
            )

            self.db_session.add(prelievomedicazione)
            self.db_session.commit()

            return {
                "message": "Prelievo o medicazione creata con successo",
                "id_prelievomedicazione": prelievomedicazione_id,
            }, 200
        except Exception as e:
            self.db_session.rollback()
            return {
                "message": "Errore durante la creazione del prelievo o medicazione: "
                + str(e)
            }, 500

    def __getInfermiereBySalaAndData(self,d, data, id_tiposala):   # id_infermiere è vuoto
        occupati_subquery = self.db_session.query(
            InfermiereModel.id_infermiere
        ).join(
            ServizioSalaModel, ServizioSalaModel.id_infermiere == InfermiereModel.id_infermiere
        ).join(
            PrelievoMedicazioneModel, PrelievoMedicazioneModel.id_infermiere == InfermiereModel.id_infermiere
        ).filter(
            ServizioSalaModel.sala == id_tiposala,
            cast(ServizioSalaModel.data, String).like(f'{d}%'),
            PrelievoMedicazioneModel.datainizio == d
        ).subquery()

        # Recupera gli infermieri per la giornata escludendo quelli occupati
        infermieri = self.db_session.query(
            InfermiereModel,
            ServizioSalaModel
        ).join(
            ServizioSalaModel, ServizioSalaModel.id_infermiere == InfermiereModel.id_infermiere
        ).filter(
            ServizioSalaModel.sala == id_tiposala,
            cast(ServizioSalaModel.data, String).like(f'{data}%'),
            ~InfermiereModel.id_infermiere.in_(occupati_subquery)
        ).all()

        if infermieri:
            return random.choice(infermieri)[0].id_infermiere          # seleziona a caso un medico disponibile
        else:
            return "no infermieri"


    @jwt_required()
    def updatePrelievoMedicazione(self, id_prelievomedicazione):  # PUT
        parser = reqparse.RequestParser()
        parser.add_argument("id_paziente", type=str, required=True)
        parser.add_argument("id_infermiere", type=str, required=True)
        parser.add_argument("datainizio", type=str, required=True)
        parser.add_argument("esito", type=str, required=False)
        parser.add_argument("note", type=str, required=False)
        parser.add_argument("id_tiposala", type=str, required=True)
        args = parser.parse_args()

        ds = datetime.strptime(args['datainizio'], "%Y-%m-%dT%H:%M:%S.%fZ")
        datas = ds.date()

        d = datetime.strptime(args['datainizio'], "%Y-%m-%dT%H:%M:%S.%fZ")
        if d.weekday() > 4:
            return {"message": "La casa salute è chiusa nel giorno proposto"}, 409

        time = d.time()
        if time < datetime_time(8,0) or time > datetime_time(17,0):
            return {"message": "La casa salute è chiusa nell'orario proposto"}, 409
        
        date = d.date()
        d_time = datetime.combine(date, datetime_time(0,0,0))
        servizio = ServizioSalaModel.query.filter_by(
            id_infermiere=args['id_infermiere'],
            data=d_time
        ).first()
        if not servizio:
            return {"message": "L'infermiere indicato non è in servizio quel giorno"}, 404
        
        tiposala = TipoSalaModel.query.filter_by(
            id_tiposala=args['id_tiposala']
        ).first()
        if not tiposala:
            return {"message": "Tiposala non esiste"}, 404

        infermiere = InfermiereModel.query.filter_by(
            id_infermiere=args["id_infermiere"]
        ).first()
        if not infermiere:
            return {"message": "Infermiere non trovato"}, 404

        paziente = PazienteModel.query.filter_by(
            id_paziente=args["id_paziente"]
        ).first()
        if not paziente:
            return {"message": "Paziente non trovato"}, 404
        
        infSala = self.db_session.query(
                InfermiereModel,
                TipoSalaModel,
                ServizioSalaModel
            ).join(
                ServizioSalaModel, InfermiereModel.id_infermiere == ServizioSalaModel.id_infermiere
            ).join(
                TipoSalaModel, TipoSalaModel.id_tiposala == ServizioSalaModel.sala
            ).filter(
                InfermiereModel.id_infermiere == args['id_infermiere'],  # Filtro per l'id dell'infermiere
                TipoSalaModel.id_tiposala == args['id_tiposala'],  # Filtro per l'id del tipo sala
                cast(ServizioSalaModel.data, String).like(f'{datas}%')  # Filtro per la data di inizio servizio
            ).first()
        if not infSala:
            return {"message": "L'infermiere non è disponibile nella sala richiesta il giorno specificato"}, 404
         
        prelievomedicazione = PrelievoMedicazioneModel.query.filter_by(
            id_prelievimedicazioni=id_prelievomedicazione
        ).first()
        if not prelievomedicazione:
            return {"message": "Prelievo medicazione non trovata"}, 404

        try:
            prelievomedicazione.id_paziente = args["id_paziente"]
            prelievomedicazione.id_medico = args["id_infermiere"]
            prelievomedicazione.datainizio = args["datainizio"]
            prelievomedicazione.note = args["note"]
            prelievomedicazione.esito = args["esito"]
            prelievomedicazione.id_tiposala = args["id_tiposala"]

            self.db_session.commit()

            return {
                "message": "Prelievo o medicazione aggiornata con successo",
                "id_prelievimedicazioni": id_prelievomedicazione,
            }, 200
        except Exception as e:
            self.db_session.rollback()
            return {"message": "Errore durante l'aggiornamento della visita: " + str(e)}, 500