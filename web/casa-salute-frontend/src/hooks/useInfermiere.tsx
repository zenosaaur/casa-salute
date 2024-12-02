import { Infermiere } from "@/hooks/type"
import { useState, useCallback } from 'react';
import axios from "axios";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/use-toast";

export interface UseInfermiereHook {
    infermieri: Infermiere[];
    infermiere: Infermiere | undefined;
    loading: boolean;
    error: string | null;
    fetchInfermieri: () => Promise<void>;
    createInfermiere: (infermiere: any) => Promise<void>;
    fetchInfermiereByUtente: (userId: string) => Promise<void>
}


const useInfermiere = (): UseInfermiereHook => {
    const [infermieri, setInfermieri] = useState<Infermiere[]>([]);
    const [infermiere, setInfermiere] = useState<Infermiere>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth()
    
    
    const fetchInfermieri = async () => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/infermieri',
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento degli infermieri');
            }
            setInfermieri(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };


    const fetchInfermiereByUtente = async (id_user: string) => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/infermiere/utente/'+id_user,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento del medico, filtrato per utente');
            }
            setInfermiere(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };

    const  createInfermiere = async (infermiere: any) => {
        setError(null)
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.post(`http://127.0.0.1:5000/infermiere`,infermiere,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error("Errore nella creazione dell'infermiere conreollare i dati ");
            }
            setInfermiere(response.data);
            setLoading(false); // Imposta lo stato di caricamento su false
            toast({
                variant: "success",
                title: "Successo",
                description:"Creazione dell'infermirere avvenutra con successo"
            })
        } catch (error: Error) {
            toast({
                variant: "default",
                title: "Errore",
                description: error.message
            })
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }


    return { infermieri, infermiere, loading, error, fetchInfermiereByUtente, fetchInfermieri,createInfermiere };
};

export default useInfermiere;
