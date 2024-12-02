from flask import request
from flask_restful import reqparse
from ..models import medico as MedicoModel
from ..models import utente as UtenteModel
from ..models import paziente as PazienteModel
from ..models import tipovisita as TipoVisitaModel
from ..models import visita as VisitaModel
from ..models import tipoambulatorio as TipoAmbulatorioModel
import uuid
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import aliased
from datetime import datetime, timedelta
from sqlalchemy import String, cast
from .assenze_repository import AssenzaRepository
from .pazienti_repository import PazienteRepository
from datetime import datetime, timedelta, time as datetime_time
from .medico_sostituto_repository import MedicoSostitutoRepository
from .tipo_ambulatorio_repository import TipoAmbulatorioRepository
from .responsabile_repository import ResponsabileRepository
from .utente_repository import UtenteRepository
import sendgrid
import os
from sendgrid.helpers.mail import *
from .base_repository import BaseRepository


class VisitaRepository(BaseRepository):
    def __init__(self, db_session):
        super(VisitaRepository,self).__init__(db_session)
        self.Assenza = AssenzaRepository(db_session)
        self.Paziente = PazienteRepository(db_session)
        self.Responsabile = ResponsabileRepository(db_session)
        self.Utente = UtenteRepository(db_session)
        self.MedicoSostituto = MedicoSostitutoRepository(db_session)
        self.TipoAmbulatorio = TipoAmbulatorioRepository(db_session)
        self.valid_times = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', 
                            '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
                            '15:00', '15:30', '16:00', '16:30']


    def __filter_appointments_by_date(self,appointments, target_date):
            # Converte la data target in oggetto datetime
            target_date = datetime.fromisoformat(target_date).date()
            # Filtra gli appuntamenti
            filtered_appointments = [
                appointment for appointment in appointments 
                if datetime.fromisoformat(appointment['datainizio']).date() == target_date
            ]
            return filtered_appointments
    
    def __getVisiteTimesByDataAndAmbulatorio(self,data, id_ambulatorio):
        data = datetime.fromisoformat(data).date()
        data = data.strftime('%Y-%m-%d')

        visite = self.db_session.query(
            VisitaModel,
            TipoAmbulatorioModel
        ).join(
            TipoAmbulatorioModel, TipoAmbulatorioModel.id_tipoambulatorio == id_ambulatorio
        ).filter(
            cast(VisitaModel.datainizio, String).like(f'{data}%')
        ).order_by(
            VisitaModel.datainizio
        ).all()

        if visite:
            visite_data = []
            for visita in visite:
                visita_dict = visita[0].to_dict()
                visita_dict['ambulatorio']=visita[1].to_dict()
                visite_data.append(visita_dict)
            return visite_data, 200
        else:
            return [], 200

    @jwt_required()
    def getVisite(self):
        paziente_utente = aliased(UtenteModel)
        medico_utente = aliased(UtenteModel)

        visite = self.db_session.query(
            VisitaModel,
            PazienteModel,
            MedicoModel,
            TipoAmbulatorioModel,
            paziente_utente,
            medico_utente
        ).join(
            PazienteModel, VisitaModel.id_paziente == PazienteModel.id_paziente
        ).join(
            MedicoModel, VisitaModel.id_medico == MedicoModel.id_medico
        ).join(
            TipoAmbulatorioModel, TipoAmbulatorioModel.id_medico == MedicoModel.id_medico
        ).join(
            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
        ).join(
            medico_utente, MedicoModel.id_utente == medico_utente.id_utente
        ).all()

        if visite:
            visite_data = []
            for visita in visite:
                visita_dict = visita[0].to_dict()
                visita_dict['medico'] = visita[2].to_dict()
                visita_dict['paziente'] = visita[1].to_dict()
                visita_dict['ambulatorio']=visita[3].to_dict()
                visita_dict['medico']['utente']=visita[5].to_dict()
                visita_dict['paziente']['utente']=visita[4].to_dict()
                visite_data.append(visita_dict)
            return visite_data, 200
        else:
            return {'message': 'Nessuna visita trovata'}, 404

    def getAvailableTimesOnDate(self,data):
        result = []
        ambulatori = self.TipoAmbulatorio.getTipiAmbulatorio()[0]
        
        if isinstance(ambulatori, dict):
            ambulatori = [ambulatori]
        
        for amb in ambulatori:
            available_times = self.getAvailableTimesOnDateAndAmbulatorio(data, amb['id_tipoambulatorio'])
            # Add availableTimes key to the amb dictionary
            amb_with_times = {**amb, 'availableTimes': available_times}
            result.append(amb_with_times)

        return result, 200

    def getAvailableTimesOnDateAndAmbulatorio(self,data, id_ambulatorio):
        if(not data):
            return self.valid_times, 200
        
        visite = self.__getVisiteTimesByDataAndAmbulatorio(data, id_ambulatorio)[0]

        booked_times = [datetime.strptime(visita['datainizio'], '%Y-%m-%d %H:%M').strftime('%H:%M') for visita in visite]
        available_times = [time for time in self.valid_times if time not in booked_times]

        return available_times, 200

    def getAvailableTimesOnDateAndMedico(self,data, id_medico):
        # recupero in che ambulatorio é presente qul medico
        tipo_ambulatorio,status = self.TipoAmbulatorio.getTipoAmbulatorioByIdMedico(id_medico)
        visite = self.__getVisiteTimesByDataAndAmbulatorio(data, tipo_ambulatorio["id_tipoambulatorio"])[0]
    
        booked_times = [datetime.strptime(visita['datainizio'], '%Y-%m-%d %H:%M').strftime('%H:%M') for visita in visite]
        available_times = [time for time in self.valid_times if time not in booked_times]
        response = {
            "times": available_times,
            "ambulatorio": tipo_ambulatorio["tipo"],
            "id_tipoambulatorio": tipo_ambulatorio["id_tipoambulatorio"],
        }
        return response, 200

    def getVisisteByMedicoSostituto(self,id_medico_sos, id_medico_base):
        paziente_utente = aliased(UtenteModel)
        medico_utente = aliased(UtenteModel)

        visite = self.db_session.query(
            VisitaModel,
            PazienteModel,
            MedicoModel,
            TipoAmbulatorioModel,
            paziente_utente,
            medico_utente
        ).join(
            PazienteModel, VisitaModel.id_paziente == PazienteModel.id_paziente
        ).join(
            MedicoModel, VisitaModel.id_medico == MedicoModel.id_medico
        ).join(
            TipoAmbulatorioModel, TipoAmbulatorioModel.id_medico == id_medico_base
        ).join(
            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
        ).join(
            medico_utente, MedicoModel.id_utente == medico_utente.id_utente
        ).filter(
            VisitaModel.id_medico == id_medico_sos
        ).order_by(
            VisitaModel.datainizio
        ).all()


        visite_data = []
        if visite:
            for visita in visite:
                visita_dict=visita[0].to_dict()
                visita_dict['medico']=visita[2].to_dict()
                visita_dict['paziente']=visita[1].to_dict()
                visita_dict['ambulatorio']=visita[3].to_dict()
                visita_dict['medico']['utente']=visita[5].to_dict()
                visita_dict['paziente']['utente']=visita[4].to_dict()
                visite_data.append(visita_dict)
        return visite_data, 200

    def getVisiteByMediciSostituti(self,id_medico):
        sostituti = self.MedicoSostituto.getMediciSostitutiByMedico(id_medico)
        
        visite = []
        if sostituti[1] != 404:
            for sostituto in sostituti[0]:
                id_sos = sostituto['id_medicosostituto']
                visite_sos = self.getVisisteByMedicoSostituto(id_sos, id_medico)
                visite.append(visite_sos[0])
            return visite, 200
        return [], 404


    @jwt_required()
    def getVisiteByMedico(self,id_medico):
        paziente_utente = aliased(UtenteModel)
        medico_utente = aliased(UtenteModel)
        id_medico_tmp = id_medico
        visite_tmp = []

        medico_base = self.db_session.query(
            TipoAmbulatorioModel
        ).filter(
            TipoAmbulatorioModel.id_medico == id_medico
        ).first()

        if medico_base:
            visite_tmp = self.getVisiteByMediciSostituti(id_medico)
        else:
            sostituto = self.MedicoSostituto.getMediciSostitutiByMedico(id_medico)
            if sostituto[1] == 404:         # sono un sotituto, devo recuperare l'ambulatorio giusto (id medico di base)
                medico_base = self.MedicoSostituto.getMedicoByMedicoSostituto(id_medico)
                id_medico_tmp = medico_base[0][1].id_medico  
            

        visite = self.db_session.query(
            VisitaModel,
            PazienteModel,
            MedicoModel,
            TipoAmbulatorioModel,
            paziente_utente,
            medico_utente
        ).join(
            PazienteModel, VisitaModel.id_paziente == PazienteModel.id_paziente
        ).join(
            MedicoModel, VisitaModel.id_medico == MedicoModel.id_medico
        ).join(
            TipoAmbulatorioModel, TipoAmbulatorioModel.id_medico == id_medico_tmp
        ).join(
            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
        ).join(
            medico_utente, MedicoModel.id_utente == medico_utente.id_utente
        ).filter(
            VisitaModel.id_medico == id_medico
        ).order_by(
            VisitaModel.datainizio
        ).all()


        if visite or visite_tmp:
            visite_data = []
            for visita in visite:
                visita_dict=visita[0].to_dict()
                visita_dict['medico']=visita[2].to_dict()
                visita_dict['paziente']=visita[1].to_dict()
                visita_dict['ambulatorio']=visita[3].to_dict()
                visita_dict['medico']['utente']=visita[5].to_dict()
                visita_dict['paziente']['utente']=visita[4].to_dict()
                visite_data.append(visita_dict)
            
            if visite_tmp != []:
                for visit in visite_tmp[0]:
                    visite_data.extend(visit)
            return visite_data, 200
        else:
            return [], 404
        
    
    @jwt_required()
    def getVisiteByMedicoPaziente(self,id_medico, id_paziente):
        paziente_utente = aliased(UtenteModel)
        medico_utente = aliased(UtenteModel)

        id_medico_tmp = id_medico
        visite_tmp = []

        sostituto = self.MedicoSostituto.getMediciSostitutiByMedico(id_medico)
        if sostituto[1] == 404:         # sono un sotituto, devo recuperare l'ambulatorio giusto (id medico di base)
            medico_base = self.MedicoSostituto.getMedicoByMedicoSostituto(id_medico)
            id_medico_tmp = medico_base[0][1].id_medico  
        else:       # recupero tutte le visite dei medici sostituti. Quello di base può vederle
            visite_tmp = self.getVisiteByMediciSostituti(id_medico)
            visite_tmp = [visit for sublist in visite_tmp[0] for visit in sublist if visit['id_paziente'] == id_paziente]


        visite = self.db_session.query(
            VisitaModel,
            PazienteModel,
            MedicoModel,
            TipoAmbulatorioModel,
            paziente_utente,
            medico_utente
        ).join(
            PazienteModel, VisitaModel.id_paziente == PazienteModel.id_paziente
        ).join(
            MedicoModel, VisitaModel.id_medico == MedicoModel.id_medico
        ).join(
            TipoAmbulatorioModel, TipoAmbulatorioModel.id_medico == id_medico_tmp
        ).join(
            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
        ).join(
            medico_utente, MedicoModel.id_utente == medico_utente.id_utente
        ).filter(
            VisitaModel.id_medico == id_medico,
            VisitaModel.id_paziente == id_paziente
        ).order_by(
            VisitaModel.datainizio
        ).all()
        
        if visite or visite_tmp:
            visite_data = []
            for visita in visite:
                visita_dict=visita[0].to_dict()
                visita_dict['medico']=visita[2].to_dict()
                visita_dict['paziente']=visita[1].to_dict()
                visita_dict['ambulatorio']=visita[3].to_dict()
                visita_dict['medico']['utente']=visita[5].to_dict()
                visita_dict['paziente']['utente']=visita[4].to_dict()
                visite_data.append(visita_dict)
            if visite_tmp != []:
                visite_data.extend(visite_tmp)
            return visite_data, 200
        else:
            return {'message': 'Nessuna visita trovata.'}, 404

    @jwt_required()
    def getVisiteByUtente(self,id_utente):
        # Recuperare il paziente associato all'utente
        paziente = self.db_session.query(PazienteModel).filter_by(
            id_utente=id_utente).first()
        
        if not paziente:
            return {'message': 'Paziente non trovato per l\'ID utente fornito'}, 404

        # Creazione degli alias per le tabelle Utente e Medico
        paziente_utente = aliased(UtenteModel)
        medico_utente = aliased(UtenteModel)
        # Query per ottenere le visite del paziente, inclusi i dettagli del medico
        visite = self.db_session.query(
            VisitaModel,
            PazienteModel,
            MedicoModel,
            TipoAmbulatorioModel,
            paziente_utente,
            medico_utente
        ).join(
            PazienteModel, VisitaModel.id_paziente == PazienteModel.id_paziente
        ).join(
            MedicoModel, VisitaModel.id_medico == MedicoModel.id_medico
        ).join(
            TipoAmbulatorioModel, VisitaModel.id_tipoambulatorio == TipoAmbulatorioModel.id_tipoambulatorio
        ).join(
            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
        ).join(
            medico_utente, MedicoModel.id_utente == medico_utente.id_utente
        ).filter(
            VisitaModel.id_paziente == paziente.id_paziente
        ).all()

        if visite:
            visite_data = []
            for visita in visite:
                # Trasformazione dei risultati in dizionari
                visita_dict = visita[0].to_dict()
                visita_dict['paziente'] = visita[1].to_dict()
                visita_dict['medico'] = visita[2].to_dict()
                visita_dict['ambulatorio'] = visita[3].to_dict()
                visita_dict['paziente']['utente'] = visita[4].to_dict()
                visita_dict['medico']['utente'] = visita[5].to_dict()
                visite_data.append(visita_dict)
            return visite_data, 200
        else:
            return {'message': 'Nessuna visita trovata'}, 404

    @jwt_required()
    def getVisiteByMedicoData(self,id_medico, data):
        data = datetime.fromisoformat(data).date()
        data = data.strftime('%Y-%m-%d')

        paziente_utente = aliased(UtenteModel)
        medico_utente = aliased(UtenteModel)

        id_medico_tmp = id_medico
        visite_tmp = []

        medico_base = self.db_session.query(
            TipoAmbulatorioModel
        ).filter(
            TipoAmbulatorioModel.id_medico == id_medico
        ).first()

        if medico_base:
            visite = self.getVisiteByMediciSostituti(id_medico)
            if visite[0] != []:
                visite_tmp =  self.__filter_appointments_by_date(visite[0][0], data)
        else:
            sostituto = self.MedicoSostituto.getMediciSostitutiByMedico(id_medico)
            if sostituto[1] == 404:         # sono un sotituto, devo recuperare l'ambulatorio giusto (id medico di base)
                medico_base = self.MedicoSostituto.getMedicoByMedicoSostituto(id_medico)
                id_medico_tmp = medico_base[0][1].id_medico  

        visite = self.db_session.query(
            VisitaModel,
            PazienteModel,
            MedicoModel,
            TipoAmbulatorioModel,
            paziente_utente,
            medico_utente
        ).join(
            PazienteModel, VisitaModel.id_paziente == PazienteModel.id_paziente
        ).join(
            MedicoModel, VisitaModel.id_medico == MedicoModel.id_medico
        ).join(
            TipoAmbulatorioModel, TipoAmbulatorioModel.id_medico == id_medico_tmp
        ).join(
            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
        ).join(
            medico_utente, MedicoModel.id_utente == medico_utente.id_utente
        ).filter(
            VisitaModel.id_medico == id_medico,
            cast(VisitaModel.datainizio, String).like(f'{data}%')
        ).order_by(
            VisitaModel.datainizio
        ).all()
        
        if visite or visite_tmp:
            visite_data = []
            for visita in visite:
                visita_dict=visita[0].to_dict()
                visita_dict['medico']=visita[2].to_dict()
                visita_dict['paziente']=visita[1].to_dict()
                visita_dict['ambulatorio']=visita[3].to_dict()
                visita_dict['medico']['utente']=visita[5].to_dict()
                visita_dict['paziente']['utente']=visita[4].to_dict()
                visite_data.append(visita_dict)
            if visite_tmp != []:
                visite_data.extend(visite_tmp)
            return visite_data, 200
        else:
            return {'message': 'Nessuna visita trovata.'}, 404
        

    @jwt_required()
    def getVisiteByMedicoPazienteData(self,id_medico, id_paziente, data):
        data = datetime.fromisoformat(data).date()
        data = data.strftime('%Y-%m-%d')

        paziente_utente = aliased(UtenteModel)
        medico_utente = aliased(UtenteModel)

        id_medico_tmp = id_medico
        visite_tmp = []

        sostituto = self.MedicoSostituto.getMediciSostitutiByMedico(id_medico)
        if sostituto[1] == 404:         # sono un sotituto, devo recuperare l'ambulatorio giusto (id medico di base)
            medico_base = self.MedicoSostituto.getMedicoByMedicoSostituto(id_medico)
            id_medico_tmp = medico_base[0][1].id_medico  
        else:       # recupero tutte le visite dei medici sostituti. Quello di base può vederle
            visite = self.getVisiteByMediciSostituti(id_medico)
            visite_tmp =  self.__filter_appointments_by_date(visite[0][0], data)
            visite_tmp = [visit for visit in visite_tmp if visit['id_paziente'] == id_paziente]

        visite = self.db_session.query(
            VisitaModel,
            PazienteModel,
            MedicoModel,
            TipoAmbulatorioModel,
            paziente_utente,
            medico_utente
        ).join(
            PazienteModel, VisitaModel.id_paziente == PazienteModel.id_paziente
        ).join(
            MedicoModel, VisitaModel.id_medico == MedicoModel.id_medico
        ).join(
            TipoAmbulatorioModel, TipoAmbulatorioModel.id_medico == id_medico_tmp
        ).join(
            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
        ).join(
            medico_utente, MedicoModel.id_utente == medico_utente.id_utente
        ).filter(
            VisitaModel.id_medico == id_medico,
            VisitaModel.id_paziente == id_paziente,
            cast(VisitaModel.datainizio, String).like(f'{data}%')
        ).order_by(
            VisitaModel.datainizio
        ).all()
        
        if visite or visite_tmp:
            visite_data = []
            for visita in visite:
                visita_dict=visita[0].to_dict()
                visita_dict['medico']=visita[2].to_dict()
                visita_dict['paziente']=visita[1].to_dict()
                visita_dict['ambulatorio']=visita[3].to_dict()
                visita_dict['medico']['utente']=visita[5].to_dict()
                visita_dict['paziente']['utente']=visita[4].to_dict()
                visite_data.append(visita_dict)
            if visite_tmp != []:
                visite_data.extend(visite_tmp)
            return visite_data, 200
        else:
            return {'message': 'Nessuna visita trovata.'}, 404


    @jwt_required()
    def getVisitaById(self,id_visita):
        paziente_utente = aliased(UtenteModel)
        medico_utente = aliased(UtenteModel)

        visita = self.db_session.query(
            VisitaModel,
            PazienteModel,
            MedicoModel,
            TipoAmbulatorioModel,
            paziente_utente,
            medico_utente
        ).join(
            PazienteModel, VisitaModel.id_paziente == PazienteModel.id_paziente
        ).join(
            MedicoModel, VisitaModel.id_medico == MedicoModel.id_medico
        ).join(
            TipoAmbulatorioModel, TipoAmbulatorioModel.id_medico == MedicoModel.id_medico
        ).join(
            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
        ).join(
            medico_utente, MedicoModel.id_utente == medico_utente.id_utente
        ).filter(
            VisitaModel.id_visita == id_visita
        ).first()

        if visita:
            visita_dict = visita[0].to_dict()
            visita_dict['medico'] = visita[2].to_dict()
            visita_dict['paziente'] = visita[1].to_dict()
            visita_dict['ambulatorio']=visita[3].to_dict()
            visita_dict['medico']['utente']=visita[5].to_dict()
            visita_dict['paziente']['utente']=visita[4].to_dict()

            return visita_dict, 200
        else:
            return {'message': 'Visita non trovato'}, 404

    @jwt_required()
    def getVisiteByData(self,data):
        data = datetime.fromisoformat(data).date()
        data = data.strftime('%Y-%m-%d')

        paziente_utente = aliased(UtenteModel)
        medico_utente = aliased(UtenteModel)

        visite = self.db_session.query(
            VisitaModel,
            PazienteModel,
            MedicoModel,
            TipoAmbulatorioModel,
            paziente_utente,
            medico_utente
        ).join(
            PazienteModel, VisitaModel.id_paziente == PazienteModel.id_paziente
        ).join(
            MedicoModel, VisitaModel.id_medico == MedicoModel.id_medico
        ).join(
            TipoAmbulatorioModel, TipoAmbulatorioModel.id_tipoambulatorio == VisitaModel.id_tipoambulatorio
        ).join(
            paziente_utente, PazienteModel.id_utente == paziente_utente.id_utente
        ).join(
            medico_utente, MedicoModel.id_utente == medico_utente.id_utente
        ).filter(
            cast(VisitaModel.datainizio, String).like(f'{data}%')
        ).order_by(
            VisitaModel.datainizio
        ).all()

        if visite:
            visite_data = []
            for visita in visite:
                visita_dict = visita[0].to_dict()
                visita_dict['medico'] = visita[2].to_dict()
                visita_dict['paziente'] = visita[1].to_dict()
                visita_dict['ambulatorio']=visita[3].to_dict()
                visita_dict['medico']['utente']=visita[5].to_dict()
                visita_dict['paziente']['utente']=visita[4].to_dict()
                visite_data.append(visita_dict)
            return visite_data, 200
        else:
            return [], 200

    @jwt_required()
    def createVisita(self):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('id_paziente', type=str, required=True)
        parser.add_argument('id_medico', type=str, required=True)
        parser.add_argument('datainizio', type=str, required=True)
        parser.add_argument('urgenza', type=str, required=False)
        parser.add_argument('esito', type=str, required=False)
        parser.add_argument('regime', type=str, required=False)
        parser.add_argument('id_tipovisita', type=str, required=False)
        parser.add_argument('id_tipoambulatorio', type=str, required=True)
        args = parser.parse_args()

        # tipovisita = TipoVisitaModel.query.filter_by(id_tipovisita=args['id_tipovisita']).first()
        # if not tipovisita:
        #     return {'message': 'Tipo di visita non trovato'}, 404

        
        d = datetime.strptime(args['datainizio'], "%Y-%m-%dT%H:%M:%S.%fZ")
        date = d.date()


        if date.weekday() > 4:
            return {"message": "La casa salute è chiusa nel giorno proposto"}, 409

        time = d.time()
        if time < datetime_time(8,0) or time > datetime_time(16,30):
            return {"message": "La casa salute è chiusa nell'orario proposto"}, 409

        tipoambulatorio = TipoAmbulatorioModel.query.filter_by(id_tipoambulatorio=args['id_tipoambulatorio']).first()
        if not tipoambulatorio:
            return {'message': 'Tipo di ambulatorio di visita non trovato'}, 404
        
        assenza,status = self.Assenza.getAssenzaByMedicoDate(args['id_medico'], args['datainizio'])
        if status != 404 :
            return {'message': 'Il medico risulta assente nella giornata indicata'}, 404

        medico = MedicoModel.query.filter_by(
            id_medico=args['id_medico']).first()
        if not medico:
            return {'message': 'Medico non trovato'}, 404

        paziente = PazienteModel.query.filter_by(
            id_paziente=args['id_paziente']).first()
        if not paziente:
            return {'message': 'Paziente non trovato'}, 404

        existing_visita = VisitaModel.query.filter_by(
            id_paziente=args['id_paziente'], id_medico=args['id_medico'], datainizio=args['datainizio']).first()
        if existing_visita:
            return {'message': 'Visita già esistente!'}, 409
        
        busy_medico = VisitaModel.query.filter_by(
            id_medico=args["id_medico"],
            datainizio=args["datainizio"]
        ).first()
        if busy_medico:
            return {"message": "Medico occupato, cambia l'orario!"}, 409

        try:
            visita_id = str(uuid.uuid4())

            visita = VisitaModel(
                id_visita=visita_id,
                id_medico=args['id_medico'],
                id_paziente=args['id_paziente'],
                datainizio=args['datainizio'],
                urgenza=args['urgenza'],
                esito=args['esito'],
                regime=args['regime'],
                id_tipovisita=args['id_tipovisita'],
                id_tipoambulatorio=args['id_tipoambulatorio'],
            )

            self.db_session.add(visita)
            self.db_session.commit()

            sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
            res, status = self.Paziente.getPazienteById(args['id_paziente'])
            email = ""
            if not res["utente"]["email"]:
                resp = self.Responsabile.getResponsabili()
                if resp:
                    for responsabile in resp:
                        if responsabile[0]['id_paziente'] == args['id_paziente']:
                            utente = self.Utente.getUtenteById(responsabile[0]['id_utente'])
                            if utente:
                                email = utente[0]['email']
                            break
            else:
                email = res["utente"]["email"]


            from_email = Email("noreply@davidezeni.it")
            to_email = To(email)
            subject = "Prenotazione visita"
            content = Content("text/plain", "Prenotata visita il giorno "+args['datainizio'])
            mail = Mail(from_email, to_email, subject, content)
            response = sg.client.mail.send.post(request_body=mail.get())

            return {'message': 'Visita creata con successo', 'id_visita': str(visita_id)}, 200
        except Exception as e:
            self.db_session.rollback()
            return {'message': 'Errore durante la creazione della visita: ' + str(e)}, 500

    @jwt_required()
    def updateVisita(self,id_visita):     # PUT
        parser = reqparse.RequestParser()
        parser.add_argument('id_paziente', type=str, required=True)
        parser.add_argument('id_medico', type=str, required=True)
        parser.add_argument('datainizio', type=str, required=True)
        parser.add_argument('urgenza', type=str, required=False)
        parser.add_argument('esito', type=str, required=False)
        parser.add_argument('regime', type=str, required=False)
        parser.add_argument('id_tipovisita', type=str, required=False)
        parser.add_argument('id_tipoambulatorio', type=str, required=False)
        args = parser.parse_args()
        # tipovisita = TipoVisitaModel.query.filter_by(id_tipovisita=args['id_tipovisita']).first()
        # if not tipovisita:
        #     return {'message': 'Tipo di visita non trovato'}, 404

        # tipoambulatorio = TipoAmbulatorioModel.query.filter_by(id_tipoambulatorio=args['id_tipoambulatorio']).first()
        # if not tipoambulatorio:
        #     return {'message': 'Tipo di ambulatorio di visita non trovato'}, 404

        d = datetime.strptime(args['datainizio'], "%Y-%m-%dT%H:%M:%S.%fZ")
        date = d.date()

        if date.weekday() > 4:
            return {"message": "La casa salute è chiusa nel giorno proposto"}, 409

        time = d.time()
        if time < datetime_time(8,0) or time > datetime_time(17,0):
            return {"message": "La casa salute è chiusa nell'orario proposto"}, 409

        assenza,status = self.Assenza.getAssenzaByMedicoDate(args['id_medico'], args['datainizio'])
        if status == 200:
            return {'message': 'Il medico risulta assente nella giornata indicata'}, 404

        medico = MedicoModel.query.filter_by(
            id_medico=args['id_medico']).first()
        if not medico:
            return {'message': 'Medico non trovato'}, 404

        paziente = PazienteModel.query.filter_by(
            id_paziente=args['id_paziente']).first()
        if not paziente:
            return {'message': 'Paziente non trovato'}, 404

        visita = VisitaModel.query.filter_by(id_visita=id_visita).first()
        if not visita:
            return {'message': 'Visita non trovata'}, 404

        try:
            visita.id_paziente = args['id_paziente']
            visita.id_medico = args['id_medico']
            visita.datainizio = args['datainizio']
            visita.urgenza = args['urgenza']
            visita.esito = args['esito']
            visita.regime = args['regime']
            visita.id_tipoambulatorio = args['id_tipoambulatorio']
            # if args['id_tipovisita']:
            #     visita.id_tipovisita = args['id_tipovisita']

            self.db_session.commit()

            return {'message': 'Visita aggiornata con successo', 'id_visita': id_visita}, 200
        except Exception as e:
            self.db_session.rollback()
            return {'message': 'Errore durante l\'aggiornamento della visita: '+str(e)}, 500
