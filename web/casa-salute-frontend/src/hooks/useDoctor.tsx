import { useState, useEffect, useCallback } from "react";
import { Medico, MedicoSostituto } from "./type";
import axios from "axios";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/use-toast";

export interface UseDoctorHook {
    medici: Medico[];
    medico: Medico | undefined;
    loading: boolean;
    error: string | null;
    mediciSostituti: MedicoSostituto[];
    fetchAllMedici: () => Promise<void>;
    fetchMedicoByUtente: (userId: string) => Promise<void>;
    fetchMediciSostitutiByMedico: (medicoId: string) => Promise<void>;
    fetchMedicoByPaziente: (pazienteId: string) => Promise<void>;
    createMedico: (medico: any) => Promise<void>;
    createMedicoAndSostituto: (medico: any) => Promise<void>;
    fetchAllMediciBase: () => Promise<void>;
}

const useDoctor = (): UseDoctorHook => {
    const [medici, setMedici] = useState<Medico[]>([]);
    const [mediciSostituti, setMediciSostituti] = useState<MedicoSostituto[]>([]);
    const [medico, setMedico] = useState<Medico>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth()

    const fetchAllMedici = useCallback(async () => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/medici',
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento dei medici');
            }
            setMedici(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }, [auth.user?.token]);;

    const fetchMedicoByUtente = async (id_user: string) => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/medico/utente/' + id_user,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento del medico, filtrato per utente');
            }
            setMedico(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };

    const fetchMedicoByPaziente = async (pazienteId: string) => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get(`http://127.0.0.1:5000/medico/paziente/${pazienteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento dei medici');
            }

            setMedico(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }

    const fetchMediciSostitutiByMedico = async (id_medico: string) => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/medicisostituti/' + id_medico,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento dei medici');
            }
            setMediciSostituti(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };

    const createMedico = async (medico: any) => {
        setError(null)
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.post(`http://127.0.0.1:5000/medico`, medico,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nella creazione dei medici');
            }
            toast({
                variant: "success",
                title: "Succes",
                description: "Medico creato"
            })
            setMedico(response.data);
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Errore nella creazione del medico"
            })
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }

    const createMedicoAndSostituto = async (medico: any) => {
        setError(null)
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.post(`http://127.0.0.1:5000/medicoandsostituto`, medico,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nella creazione dei medici');
            }
            toast({
                variant: "success",
                title: "Succes",
                description: "Medico creato"
            })
            setMedico(response.data);
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Errore nella creazione del medico"
            })
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }

    const fetchAllMediciBase = useCallback(async () => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/medicibase',
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento dei medici');
            }
            setMedici(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }, [auth.user?.token]);;


    return { medici, medico, mediciSostituti, loading, error, fetchMedicoByUtente, fetchAllMedici, fetchMediciSostitutiByMedico, fetchMedicoByPaziente, createMedico, createMedicoAndSostituto, fetchAllMediciBase };
};

export default useDoctor;
