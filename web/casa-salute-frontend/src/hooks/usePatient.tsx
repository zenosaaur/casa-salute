import { Paziente } from "@/hooks/type"
import { useState, useCallback } from 'react';
import axios from "axios";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/use-toast";

export interface UsePatientHook {
    pazienti: Paziente[];
    paziente: Paziente | undefined;
    loading: boolean;
    error: string | null;
    fetchAllPazienti: () => Promise<void>;
    fetchAllPazientiByMedico: (id_medico: string) => Promise<void>;
    fetchPazienteByUtente: (id_utente: string) => Promise<void>;
    createPaziente: (paziente: any) => Promise<void>
}


const usePaziente = (): UsePatientHook => {
    const [pazienti, setVisit] = useState<Paziente[]>([]);
    const [paziente, setPaziente] = useState<Paziente>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth()

    const fetchAllPazienti = useCallback(async () => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/pazienti',
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
            setVisit(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }, [auth.user?.token]);

    const fetchPazienteByUtente = async (id_utente: string) => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get(`http://127.0.0.1:5000/paziente/utente/${id_utente}`,
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
            setPaziente(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }

    const fetchAllPazientiByMedico = async (id_medico: string) => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get(`http://127.0.0.1:5000/pazienti/${id_medico}`,
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
            setVisit(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }
    
    const  createPaziente = async (paziente: any) => {
        setError(null)
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.post(`http://127.0.0.1:5000/paziente`,paziente,
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
                title: "Paziente",
                description: "Paziente creato con successo"
            })
            setPaziente(response.data);
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            toast({
                variant: "default",
                title: "Errore",
                description: "Errore nella creazione del paziente"
            })
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }


    return { pazienti, paziente, loading, error, fetchAllPazienti, fetchAllPazientiByMedico, fetchPazienteByUtente,createPaziente};
};

export default usePaziente;
