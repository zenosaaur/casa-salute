-- Drop extension if exists
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- Drop tables if they exist
DROP TABLE IF EXISTS PrelieviMedicazioni;
DROP TABLE IF EXISTS Visita;
DROP TABLE IF EXISTS ServizioSala;
DROP TABLE IF EXISTS MedicoSostituzione;
DROP TABLE IF EXISTS Assenza;
DROP TABLE IF EXISTS Responsabile;
DROP TABLE IF EXISTS Segretaria;
DROP TABLE IF EXISTS Paziente;
DROP TABLE IF EXISTS Infermiere;
DROP TABLE IF EXISTS Medico;
DROP TABLE IF EXISTS Utente;
DROP TABLE IF EXISTS TipoVisita;
DROP TABLE IF EXISTS TipoAmbulatorio;
DROP TABLE IF EXISTS TipoSala;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TipoSala
CREATE TABLE TipoSala (
    ID_TipoSala UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Tipo VARCHAR(50)
);

-- TipoAmbulatorio
CREATE TABLE TipoAmbulatorio (
    ID_TipoAmbulatorio UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Tipo VARCHAR(50)
);

-- TipoVisita
CREATE TABLE TipoVisita (
    ID_TipoVisita UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Tipo VARCHAR(50)
);

-- Utente
CREATE TABLE Utente (
    ID_Utente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Nome VARCHAR(50),
    Cognome VARCHAR(50),
    Email VARCHAR(50) IS NULL,
    Password VARCHAR(50) IS NULL,
    CodiceFiscale VARCHAR(50) IS NULL,
    Data TIMESTAMP IS NULL,
    LuogoNascita VARCHAR(50) IS NULL
);

-- Medico
CREATE TABLE Medico (
    ID_Medico UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ID_Utente UUID REFERENCES Utente(ID_Utente),
    Specializzazione VARCHAR(50) IS NULL
);

-- Paziente
CREATE TABLE Paziente (
    ID_Paziente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ID_Utente UUID REFERENCES Utente(ID_Utente),
    ID_Medico UUID REFERENCES Medico(ID_Medico),
    CodiceSanitario INTEGER
);

-- Infermiere
CREATE TABLE Infermiere (
    ID_Infermiere UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ID_Utente UUID REFERENCES Utente(ID_Utente)
);

-- Responsabile
CREATE TABLE Responsabile (
    ID_Responsabile UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ID_Utente UUID REFERENCES Utente(ID_Utente),
    ID_Paziente UUID REFERENCES Paziente(ID_Paziente)
);

-- Segretaria
CREATE TABLE Segretaria (
    ID_Segretaria UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ID_Utente UUID REFERENCES Utente(ID_Utente)
);

-- Assenza
CREATE TABLE Assenza (
    Id_Assenza UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ID_Medico UUID REFERENCES Medico(ID_Medico),
    Data TIMESTAMP
);

-- MedicoSostituzione
CREATE TABLE MedicoSostituzione (
    ID_MedicoSostituzione UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ID_Medico UUID REFERENCES Medico(ID_Medico),
    ID_MedicoSostituto UUID REFERENCES Medico(ID_Medico)
);

-- ServizioSala
CREATE TABLE ServizioSala (
    ID_ServizioSala UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ID_Infermiere UUID REFERENCES Infermiere(ID_Infermiere),
    Data TIMESTAMP,
    Sala UUID REFERENCES TipoSala(ID_TipoSala)
);

-- Visita
CREATE TABLE Visita (
    ID_Visita UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ID_Paziente UUID REFERENCES Paziente(ID_Paziente),
    ID_Medico UUID REFERENCES Medico(ID_Medico),
    DataInizio TIMESTAMP,
    DataFine TIMESTAMP IS NULL,
    Urgenza VARCHAR(50) IS NULL,
    Esito VARCHAR(100) IS NULL,
    Regime VARCHAR(50) IS NULL,
    ID_TipoVisita UUID REFERENCES TipoVisita(ID_TipoVisita),
    ID_TipoAmbulatorio UUID REFERENCES TipoAmbulatorio(ID_TipoAmbulatorio)
);

-- PrelieviMedicazioni
CREATE TABLE PrelieviMedicazioni (
    ID_PrelieviMedicazioni UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ID_Paziente UUID REFERENCES Paziente(ID_Paziente),
    ID_Infermiere UUID REFERENCES Infermiere(ID_Infermiere),
    DataInizio TIMESTAMP,
    DataFine TIMESTAMP IS NULL,
    Esito VARCHAR(50) IS NULL,
    Note VARCHAR(100) IS NULL
);
