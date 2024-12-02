import { z } from "zod"

export interface ComboValue {
  label: string,
  value: string,
}

const utenteSchema = z.object({
  codicefiscale: z.string().optional(),
  cognome: z.string().optional(),
  data: z.string().optional(),
  email: z.string().optional(),
  id_utente: z.string().optional(),
  luogonascita: z.string().optional(),
  nome: z.string().optional()
});

const medicoSchema = z.object({
  id_medico: z.string().optional(),
  id_utente: z.string().optional(),
  specializzazione: z.string().optional(),
  utente: utenteSchema.optional(),
});

const infermiereSchema = z.object({
  id_infermiere: z.string().optional(),
  id_utente: z.string().optional(),
  utente: utenteSchema.optional(), 
});

const pazienteSchema = z.object({
  codicesanitario: z.number().optional(),
  id_medico: z.string().optional(),
  id_utente: z.string().optional(),
  id_paziente: z.string().optional(),
  utente: utenteSchema.optional(),
});

export const assenzaFormSchema = z.object({
  medico: medicoSchema,
  data: z.date().optional()
});

export const tiposala = z.object({
  id_tiposala: z.string(),
  tipo: z.string()
})

export const servizioSalaFormSchema = z.object({
  infermiere: infermiereSchema,
  data: z.date(),
  sala: tiposala
});

export const tipoAmbulatorio = z.object({
  id_tipoambulatorio: z.string().optional(),
  tipo: z.string().optional(),
  id_medico: z.string().optional(),
  medico: medicoSchema.optional()
})

export const visitFormSchema = z.object({
  medico: medicoSchema,
  paziente: pazienteSchema,
  datainizio: z.date().optional(),
  regime: z.string().optional(),
  esito: z.string().optional(),
  urgenza: z.string().optional(),
  ambulatorio: tipoAmbulatorio.optional()
});


export const infermiereFormSchema = z.object({
  codicefiscale: z.string().regex(/^(?:[A-Z][AEIOU][AEIOUX]|[AEIOU]X{2}|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i),
  password: z.string(),
  cognome: z.string(),
  data: z.string().regex(/^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/([0-9][0-9])*$/i).refine((data) => {
    const dateParts = data.split("/");
    const year = parseInt(dateParts[2], 10);
    const currentYear = new Date().getFullYear();
    if(currentYear < year){
      return false
    }
    return true 
  },{message: "Data invalida"}),
  email: z.string(),
  luogonascita: z.string(),
  nome: z.string(),
});

export const patientFormSchema = z.object({
  medico: medicoSchema,
  codicefiscale: z.string().regex(/^(?:[A-Z][AEIOU][AEIOUX]|[AEIOU]X{2}|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i),
  password: z.string(),
  cognome: z.string(),
  data: z.string().regex(/^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/([0-9][0-9])*$/i).refine((data) => {
    const dateParts = data.split("/");
    const year = parseInt(dateParts[2], 10);
    const currentYear = new Date().getFullYear();
    if(currentYear < year){
      return false
    }
    return true 
  },{message: "Data invalida"}),
  email: z.string(),
  luogonascita: z.string(),
  nome: z.string(),
  codicesanitario: z.string(),
});

export const medicoFormSchema = z.object({
  codicefiscale: z.string().regex(/^(?:[A-Z][AEIOU][AEIOUX]|[AEIOU]X{2}|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i),
  password: z.string(),
  cognome: z.string(),
  data: z.string().regex(/^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/([0-9][0-9])*$/i).refine((data) => {
    const dateParts = data.split("/");
    const year = parseInt(dateParts[2], 10);
    const currentYear = new Date().getFullYear();
    if(currentYear < year){
      return false
    }
    return true 
  },{message: "Data invalida"}),
  email: z.string(),
  luogonascita: z.string(),
  nome: z.string(),
  specializzazione: z.string(),
  medico: medicoSchema,
});

export const patientRespFormSchema = z.object({
  medico: medicoSchema,
  codicefiscale: z.string().regex(/^(?:[A-Z][AEIOU][AEIOUX]|[AEIOU]X{2}|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i),
  nome: z.string(),
  cognome: z.string(),
  codicesanitario: z.string(),
  data: z.string().regex(/^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/([0-9][0-9])*$/i).refine((data) => {
    const dateParts = data.split("/");
    const year = parseInt(dateParts[2], 10);
    const currentYear = new Date().getFullYear();
    if(currentYear < year){
      return false
    }else if(currentYear-year > 14){
      return false
    }
    return true
  },{message: "Data invalida"}),
  luogonascita: z.string(),
  codicefiscale_resp: z.string().regex(/^(?:[A-Z][AEIOU][AEIOUX]|[AEIOU]X{2}|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i),
  nome_resp: z.string(),
  cognome_resp: z.string(),
  luogonascita_resp: z.string(),
  data_resp: z.string().regex(/^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/([0-9][0-9])*$/i).refine((data) => {
    const dateParts = data.split("/");
    const year = parseInt(dateParts[2], 10);
    const currentYear = new Date().getFullYear();
    if(currentYear < year){
      return false
    }
    return true 
  },{message: "Data invalida"}),
  password: z.string(),
  email: z.string(),
});

export const medicazioneFormSchema = z.object({
  infermiere: infermiereSchema,
  paziente: pazienteSchema,
  datainizio: z.date(),
  esito: z.string().optional(),
  note: z.string().optional(),
  premed: z.string(),
});


