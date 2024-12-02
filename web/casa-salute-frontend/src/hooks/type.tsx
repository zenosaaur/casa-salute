export interface Utente {
    codicefiscale: string,
    cognome: string,
    data: string,
    email: string,
    id_utente: string,
    luogonascita: string,
    nome: string,
    ruolo: string,
}

export interface Medico {
    id_medico: string;
    id_utente: string;
    specializzazione: string;
    utente: Utente;
}

export interface Assenza {
    id_assenza: string;
    id_medico: string;
    data: string;
    medico: Medico
}

export interface MedicoSostituto {
    id_medicosostituzione: string;
    id_medico: string;
    id_medicosostituto: string;
    medico: Medico;
    medicoSostituto: Medico;
}

export interface Paziente {
    codicesanitario: number;
    id_medico: string;
    id_utente: string;
    id_paziente: string;
    utente: Utente;
}

export interface Infermiere {
    id_utente: string;
    id_infermiere: string;
    utente: Utente;
}
export interface Visit {
    id_visita: string;
    id_paziente: string;
    id_medico: string;
    datainizio: string;
    datafine: string;
    esito: string;
    urgenza: string;
    regime: string;
    id_tipovisita: string;
    id_tipoambulatorio: string;
    medico: Medico;
    paziente: Paziente;
    ambulatorio: Ambulatorio
}

export interface Ambulatorio {
    id_tipoambulatorio: string;
    tipo: string;
    id_medico: string;
    medico: Medico;
}

export interface PrelieviMedicazioni {
    prelievi: PrelievoMedicazione[];
    medicazioni: PrelievoMedicazione[];
}

export interface PrelievoMedicazione {
    id_prelievimedicazioni: string;
    id_paziente: string;
    id_infermiere: string;
    datainizio: string;
    esito: string;
    note: string;
    infermiere: Infermiere;
    paziente: Paziente;
    id_tiposala: string;
}

export interface ServizioSala {
    id_serviziosala: string;
    id_infermiere: string;
    data: string;
    sala: TipoSala;
    infermiere: Infermiere;
}

export interface TipoSala {
    id_tiposala: string;
    tipo: string;
}

export interface Responsabile {
    id_responsabile: string;
    id_utente: string;
    id_paziente: string;
    utente: Utente;
    paziente: Paziente;
}

export interface AvailableTimes extends Ambulatorio {
    availableTimes: string[]
} 
