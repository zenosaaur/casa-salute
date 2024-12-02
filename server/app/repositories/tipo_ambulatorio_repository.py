from flask_restful import reqparse
from ..models import tipoambulatorio as TipoAmbulatorioModel
from ..models import medico as MedicoModel
from ..models import utente as UtenteModel
import uuid
from flask_jwt_extended import jwt_required
from .medico_sostituto_repository import MedicoSostitutoRepository
from .base_repository import BaseRepository


class TipoAmbulatorioRepository(BaseRepository):
    def __init__(self, db_session):
        super(TipoAmbulatorioRepository,self).__init__(db_session)
        self.MedicoSostituto = MedicoSostitutoRepository(db_session)

    @jwt_required()
    def getTipiAmbulatorio(self):    # GET
        tipiambulatorio = self.db_session.query(
            TipoAmbulatorioModel,
            MedicoModel,
            UtenteModel
        ) .join(
            MedicoModel, TipoAmbulatorioModel.id_medico == MedicoModel.id_medico
        ).join(
            UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente
        ).all()
        # TipoAmbulatorioModel.query.all()

        if tipiambulatorio:
            tipi = []
            for tipo in tipiambulatorio:
                tipo_dict = tipo[0].to_dict()
                tipo_dict['medico'] = tipo[1].to_dict()
                tipo_dict['medico']['utente'] = tipo[2].to_dict()
                tipi.append(tipo_dict)
            return tipi, 200
        else:
            return {'message': 'Nessun tipo di ambulatorio trovato'}, 404

    @jwt_required()
    def getTipoAmbulatorioById(self,id_tipoambulatorio):   # GET
        tipoambulatorio = self.db_session.query(
            TipoAmbulatorioModel,
            MedicoModel,
            UtenteModel
        ) .join(
            MedicoModel, TipoAmbulatorioModel.id_medico == MedicoModel.id_medico
        ).join(
            MedicoModel, MedicoModel.id_utente == UtenteModel.id_utente
        ).filter(
            TipoAmbulatorioModel.id_tipoambulatorio == id_tipoambulatorio
        ).first()
        # TipoAmbulatorioModel.query.all()

        if tipoambulatorio:
            tipo_dict = tipoambulatorio[0].to_dict()
            tipo_dict['medico'] = tipoambulatorio[1].to_dict()
            tipo_dict['medico']['utente'] = tipoambulatorio[2].to_dict()

            return tipoambulatorio, 200
        else:
            return {'message': 'Tipo di ambulatorio non trovato'}, 404
        
    @jwt_required()
    def getTipoAmbulatorioByIdMedico(self,id_medico):   # GET
        # ! se il medico è quello di base allora ho l'ambulatorio diretto, se invece il medico è quello che sostituisce allora devo cercare quale medico di base sostituisce
        tipoambulatorio = self.db_session.query(
            TipoAmbulatorioModel,
            MedicoModel,
            UtenteModel
        ).join(
            MedicoModel, TipoAmbulatorioModel.id_medico == MedicoModel.id_medico
        ).join(
            UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente
        ).filter(
            TipoAmbulatorioModel.id_medico == id_medico
        ).first()

        if not tipoambulatorio:
            medico = self.MedicoSostituto.getMedicoByMedicoSostituto(id_medico)
            tipoambulatorio = self.db_session.query(
            TipoAmbulatorioModel,
            MedicoModel,
            UtenteModel
            ).join(
                MedicoModel, TipoAmbulatorioModel.id_medico == MedicoModel.id_medico
            ).join(
                UtenteModel, MedicoModel.id_utente == UtenteModel.id_utente
            ).filter(
                TipoAmbulatorioModel.id_medico == medico[0][1].id_medico
            ).first()

        if tipoambulatorio:
            tipo_dict = tipoambulatorio[0].to_dict()
            tipo_dict['medico'] = tipoambulatorio[1].to_dict()
            tipo_dict['medico']['utente'] = tipoambulatorio[2].to_dict()

            return tipo_dict, 200
        else:
            return {'message': 'Tipo di ambulatorio non trovato'}, 404
    
    @jwt_required()         # ?????? NON SERVE ??????
    def createTipoAmbulatorio(self):     # POST
        parser = reqparse.RequestParser()
        parser.add_argument('tipo', type=str, required=True)
        args = parser.parse_args()

        existing_tipoambulatorio = TipoAmbulatorioModel.query.filter_by(tipo=args['tipo']).first()
        if existing_tipoambulatorio:
            return {'message': 'Tipo di ambulatorio già presente!'}, 409 

        try:
            tipoambulatorio = TipoAmbulatorioModel(
                id_tipoambulatorio=uuid.uuid4(),
                tipo=args['tipo'],
            )

            self.db_session.add(tipoambulatorio)
            self.db_session.commit()

            return {'message': 'Tipo di ambulatorio creato con successo', 'id_tipoambulatorio': str(tipoambulatorio.id_tipoambulatorio)}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante la creazione del tipo di ambulatorio: '+str(e)}, 500
    
    @jwt_required()             # ?????? NON SERVE ???????
    def updateTipoAmbulatorio(self,id_tipoambulatorio):     # PUT
        parser = reqparse.RequestParser()
        parser.add_argument('tipo', type=str, required=True)
        args = parser.parse_args()

        tipoambulatorio = TipoAmbulatorioModel.query.filter_by(id_tipoambulatorio=id_tipoambulatorio).first()
        if not tipoambulatorio:
            return {'message': 'Tipo di ambulatorio non trovato'}, 404

        try:
            if args['tipo']:
                tipoambulatorio.tipo = args['tipo']

            self.db_session.commit()

            return {'message': 'Tipo di ambulatorio aggiornato con successo', 'id_tipoambulatorio': id_tipoambulatorio}, 200
        except Exception as e:
            self.db_session.rollback() 
            return {'message': 'Errore durante l\'aggiornamento del tipo di ambulatorio: '+str(e)}, 500

    