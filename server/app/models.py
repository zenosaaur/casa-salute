from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from .extensions import db

class tiposala(db.Model):
    __tablename__ = 'tiposala'
    id_tiposala = db.Column(UUID(as_uuid=True), primary_key=True)
    tipo = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id_tiposala': str(self.id_tiposala),
            'tipo': self.tipo
        }

class tipoambulatorio(db.Model):
    __tablename__ = 'tipoambulatorio'
    id_tipoambulatorio = db.Column(UUID(as_uuid=True), primary_key=True)
    tipo = db.Column(db.String(50))
    id_medico = db.Column(UUID(as_uuid=True))

    def to_dict(self):
        return {
            'id_tipoambulatorio': str(self.id_tipoambulatorio),
            'tipo': self.tipo,
            'id_medico': self.id_medico
        }

class tipovisita(db.Model):
    __tablename__ = 'tipovisita'
    id_tipovisita = db.Column(UUID(as_uuid=True), primary_key=True)
    tipo = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id_tipovisita': str(self.id_tipovisita),
            'tipo': self.tipo
        }
    

class utente(db.Model):
    __tablename__ = 'utente'        
    id_utente = db.Column(UUID(as_uuid=True), primary_key=True)
    nome = db.Column(db.String(50))
    cognome = db.Column(db.String(50))
    email = db.Column(db.String(50), nullable=True)
    password = db.Column(db.String(50), nullable=True)
    codicefiscale = db.Column(db.String(50), nullable=True)
    data = db.Column(db.TIMESTAMP, nullable=True)
    luogonascita = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            'id_utente': str(self.id_utente),
            'nome': self.nome,
            'cognome': self.cognome,
            'email': self.email,
            'codicefiscale': self.codicefiscale,
            'data': self.data.strftime('%Y-%m-%d %H:%M'),
            'luogonascita': self.luogonascita
        }

class medico(db.Model):
    __tablename__ = 'medico'
    id_medico = db.Column(UUID(as_uuid=True), primary_key=True)
    id_utente = db.Column(UUID(as_uuid=True), db.ForeignKey('utente.id_utente'))
    specializzazione = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            'id_medico': str(self.id_medico),
            'id_utente': str(self.id_utente),
            'specializzazione': self.specializzazione,
        }

class paziente(db.Model):
    __tablename__ = 'paziente'
    id_paziente = db.Column(UUID(as_uuid=True), primary_key=True)
    id_utente = db.Column(UUID(as_uuid=True), db.ForeignKey('utente.id_utente'))
    id_medico = db.Column(UUID(as_uuid=True), db.ForeignKey('medico.id_medico'))
    codicesanitario = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id_paziente': str(self.id_paziente),
            'id_utente': str(self.id_utente),
            'id_medico': str(self.id_medico),
            'codicesanitario': self.codicesanitario
        }

class infermiere(db.Model):
    __tablename__ = 'infermiere'
    id_infermiere = db.Column(UUID(as_uuid=True), primary_key=True)
    id_utente = db.Column(UUID(as_uuid=True), db.ForeignKey('utente.id_utente'))

    def to_dict(self):
        return {
            'id_infermiere': str(self.id_infermiere),
            'id_utente': str(self.id_utente)
        }

class responsabile(db.Model):
    __tablename__ = 'responsabile'
    id_responsabile = db.Column(UUID(as_uuid=True), primary_key=True)
    id_utente = db.Column(UUID(as_uuid=True), db.ForeignKey('utente.id_utente'))
    id_paziente = db.Column(UUID(as_uuid=True), db.ForeignKey('paziente.id_paziente'))

    def to_dict(self):
        return {
            'id_responsabile': str(self.id_responsabile),
            'id_utente': str(self.id_utente),
            'id_paziente': str(self.id_paziente)
        }

class segretaria(db.Model):
    __tablename__ = 'segretaria'
    id_segretaria = db.Column(UUID(as_uuid=True), primary_key=True)
    id_utente = db.Column(UUID(as_uuid=True), db.ForeignKey('utente.id_utente'))

    def to_dict(self):
        return {
            'id_segretaria': str(self.id_segretaria),
            'id_utente': str(self.id_utente)
        }

class assenza(db.Model):
    __tablename__ = 'assenza'
    id_assenza = db.Column(UUID(as_uuid=True), primary_key=True)
    id_medico = db.Column(UUID(as_uuid=True), db.ForeignKey('medico.id_medico'))
    data = db.Column(db.TIMESTAMP)

    def to_dict(self):
        return {
            'id_assenza': str(self.id_assenza),
            'id_medico': str(self.id_medico),
            'data': self.data.strftime('%Y-%m-%d %H:%M')
        }

class medicosostituzione(db.Model):
    __tablename__ = 'medicosostituzione'
    id_medicosostituzione = db.Column(UUID(as_uuid=True), primary_key=True)
    id_medico = db.Column(UUID(as_uuid=True), db.ForeignKey('medico.id_medico'))
    id_medicosostituto = db.Column(UUID(as_uuid=True), db.ForeignKey('medico.id_medico'))

    def to_dict(self):
        return {
            'id_medicosostituzione': str(self.id_medicosostituzione),
            'id_medico': str(self.id_medico),
            'id_medicosostituto': str(self.id_medicosostituto)
        }

class serviziosala(db.Model):
    __tablename__ = 'serviziosala'
    id_serviziosala = db.Column(UUID(as_uuid=True), primary_key=True)
    id_infermiere = db.Column(UUID(as_uuid=True), db.ForeignKey('infermiere.id_infermiere'))
    data = db.Column(db.TIMESTAMP)
    sala = db.Column(UUID(as_uuid=True), db.ForeignKey('tiposala.id_tiposala'))

    def to_dict(self):
        return {
            'id_serviziosala': str(self.id_serviziosala),
            'id_infermiere': str(self.id_infermiere),
            'data': self.data.strftime('%Y-%m-%d %H:%M'),
            'sala': self.sala
        }

class visita(db.Model):
    __tablename__ = 'visita'
    id_visita = db.Column(UUID(as_uuid=True), primary_key=True)
    id_paziente = db.Column(UUID(as_uuid=True), db.ForeignKey('paziente.id_paziente'))
    id_medico = db.Column(UUID(as_uuid=True), db.ForeignKey('medico.id_medico'))
    datainizio = db.Column(db.TIMESTAMP)
    urgenza = db.Column(db.String(50), nullable=True)
    esito = db.Column(db.String(100), nullable=True)
    regime = db.Column(db.String(50), nullable=True)
    id_tipovisita = db.Column(UUID(as_uuid=True), db.ForeignKey('tipovisita.id_tipovisita'))
    id_tipoambulatorio = db.Column(UUID(as_uuid=True), db.ForeignKey('tipoambulatorio.id_tipoambulatorio'))

    def to_dict(self):
        return {
            'id_visita': str(self.id_visita),
            'id_paziente': str(self.id_paziente),
            'id_medico': str(self.id_medico),
            'datainizio': self.datainizio.strftime('%Y-%m-%d %H:%M'),
            'urgenza': self.urgenza,
            'esito': self.esito,
            'regime': self.regime,
            'id_tipovisita': str(self.id_tipovisita),
            'id_tipoambulatorio': str(self.id_tipoambulatorio   ) 
        }

class prelievimedicazioni(db.Model):
    __tablename__ = 'prelievimedicazioni'
    id_prelievimedicazioni = db.Column(UUID(as_uuid=True), primary_key=True)
    id_paziente = db.Column(UUID(as_uuid=True), db.ForeignKey('paziente.id_paziente'))
    id_infermiere = db.Column(UUID(as_uuid=True), db.ForeignKey('infermiere.id_infermiere'))
    datainizio = db.Column(db.TIMESTAMP)
    esito = db.Column(db.String(50), nullable=True)
    note = db.Column(db.String(100), nullable=True)
    id_tiposala = db.Column(UUID(as_uuid=True), db.ForeignKey('tiposala.id_tiposala'))

    def to_dict(self):
        return {
            'id_prelievimedicazioni': str(self.id_prelievimedicazioni),
            'id_paziente': str(self.id_paziente),
            'id_infermiere': str(self.id_infermiere),
            'datainizio': self.datainizio.strftime('%Y-%m-%d %H:%M'),
            'esito': self.esito,
            'note': self.note,
            'id_tiposala': str(self.id_tiposala)
        }

