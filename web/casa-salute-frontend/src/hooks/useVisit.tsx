import { AvailableTimes, Visit } from "@/hooks/type"
import { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/use-toast";
import { convertToISO8601 } from "@/lib/utils";

export interface UseVisitHook {
    visite: Visit[];
    availableTimesInAmbulatorio: string[];
    loading: boolean;
    fetchAllVisites: () => Promise<void>;
    fetchVisitesByDoctor: (doctorId: string) => Promise<void>;
    fetchVisitesByUser: () => Promise<void>;
    fetchVisitesByDate: (data: string) => Promise<void>;
    updateVisita: (id_visita: string, visita: any) => Promise<void>;
    addVisita: (visita: any) => Promise<void>;
    fetchVisitesByDoctorDate: (id_medico: string, date: any) => Promise<void>;
    fetchVisitesByDoctorAndPatient: (id_medico: string, id_paziente: string) => Promise<void>;
    fetchVisitesByDoctorAndPatientDate: (id_medico: string, id_paziente: string, date: any) => Promise<void>;
    fetchVisitTimesByAmbulatorio: (data: string, id_amb: string) => Promise<void>
    fecthAvailableTimesOnDateAndMedico: (id_medico: string, date: any) => Promise<void>;
    error: string | null;
}

// quindi implementare getDate
const useVisit = (): UseVisitHook => {
    const [visite, setVisit] = useState<Visit[]>([]);
    const [availableTimesInAmbulatorio, setAvailableTimesInAmbulatorio] = useState<string[]>([
        '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', 
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth()

    const fetchVisitTimesByAmbulatorio = useCallback(async (data: string, id_amb: string) => {
        setAvailableTimesInAmbulatorio([])
        try {
            const response = await axios.get(`http://127.0.0.1:5000/visite/available/ambulatorio/${id_amb}`, {
                params: {
                    data: data
                },
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`,
                    'Access-Control-Allow-Origin': true
                },
            });
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle visite');
            }
            setAvailableTimesInAmbulatorio(response.data)
            setLoading(false); 
        } catch (error: any) {
            setError(error.message); 
            setLoading(false);
        }
    }, []);

    const fetchAllVisites = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/visite', {
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`,
                },
            });
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle visite');
            }
            setVisit(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }, [auth.user?.token]);

    const fetchVisitesByDoctor = async (id_doctor: string) => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/visite/medico/' + id_doctor,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`
                    }
                });
            
            setVisit(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Il medico indicato non ha effettuato nessuna visita"
            })
            setVisit([])
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };

    const fetchVisitesByDoctorDate = async (id_doctor: string, date: Date) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/visite/medicodata/${id_doctor}`, {
                params: {
                    data: date
                },
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`,
                    'Access-Control-Allow-Origin': true
                }
            });
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle visite, filtrate per medico');
            }
            setVisit(response.data);
            setLoading(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Nessuna visita trovata"
            })
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchVisitesByUser = useCallback(async () => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/visite/paziente/' + auth.user?.utente,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle visite, filtrate per paziente');
            }
            setVisit(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }, [auth.user?.token])

    const fetchVisitesByDate = async (data: string) => {
        setLoading(true)
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/visite/data/' + data,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle visite, filtrate per data');
            }
            setVisit(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };

    const fetchVisitesByDoctorAndPatient = async (id_medico: string, id_paziente: string) => {
        setVisit([])
        try {
            const response = await axios.get(`http://127.0.0.1:5000/visite/medicopaziente/${id_medico}/${id_paziente}`, {
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`,
                    'Access-Control-Allow-Origin': true
                }
            });
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle visite, filtrate per medico e paziente');
            }
            setVisit(response.data);
            setLoading(false);
        } catch (error: any) {
            toast({
                variant: "default",
                title: "Errore",
                description: "Nessuna visita trovata relativa al paziente"
            })
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchVisitesByDoctorAndPatientDate = async (id_medico: string, id_paziente: string, date: Date) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/visite/medicopazientedata/${id_medico}/${id_paziente}`, {
                params: {
                    data: date
                },
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`,
                    'Access-Control-Allow-Origin': true
                }
            });
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle visite, filtrate per medico');
            }
            setVisit(response.data);
            setLoading(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Nessuna visita trovata"
            })
            setError(error.message);
            setLoading(false);
        }
    };
    

    const fecthAvailableTimesOnDateAndMedico = async (id_medico: string, date: Date) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/visite/available/${convertToISO8601(date)}/${id_medico}`, {
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`,
                    'Access-Control-Allow-Origin': true
                }
            });
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle visite, filtrate per medico');
            }
            setLoading(false);
            return response.data;
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Nessuna visita trovata"
            })
            setLoading(false);
        }
    };


    const updateVisita = async (id_visita: string, visita: any) => {
        console.log(visita)
        try {
            const response = await axios.put(`http://127.0.0.1:5000/visita/${id_visita}`, visita, {
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`,
                }
            });
            if (response.status !== 200) {
                toast({
                    variant: "destructive",
                    title: "Errore",
                    description: response.data.message
                })
                throw new Error('Errore nell\'aggiornamento della visita');
            }
            toast({
                variant: "success",
                title: "Successo",
                description: "Visita aggiornata con successo"
            })
            setLoading(false);
            return response.data
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: error.response.data.message
            })
            setError(error.message);
            setLoading(false);
        }
    };

    const addVisita = async (visita: any) => {
        try {
            const response = await axios.post(`http://127.0.0.1:5000/visita`, visita, {
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`,
                    'Access-Control-Allow-Origin': true
                }
            });
            if (response.status !== 200) {
                toast({
                    variant: "destructive",
                    title: "Errore",
                    description: response.data.message
                })
                throw new Error('Errore nell\'aggiornamento della visita');
            }
            toast({
                variant: "success",
                title: "Successo",
                description: "Visita creata con successo"
            })
            setLoading(false);
            return response.data
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: error.response.data.message
            })
            setError(error.message);
            setLoading(false);
        }
    };




    return { visite, availableTimesInAmbulatorio, loading, error, fetchAllVisites, fetchVisitesByDoctor, fetchVisitesByDate, updateVisita, fetchVisitesByDoctorDate, addVisita, fetchVisitesByUser, fetchVisitesByDoctorAndPatient, fetchVisitesByDoctorAndPatientDate, fetchVisitTimesByAmbulatorio,fecthAvailableTimesOnDateAndMedico }
};

export default useVisit;
