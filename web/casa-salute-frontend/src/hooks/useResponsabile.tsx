import { Responsabile } from "@/hooks/type"
import { useState } from 'react';
import axios from "axios";
import { useAuth } from "./useAuth";

export interface UseResponsabileHook {
    responsabile: Responsabile[] | undefined;
    loading: boolean;
    error: string | null;
    fetchResponsabileByUtente: (id_utente: string) => Promise<void>;
}


const useResponsabile = (): UseResponsabileHook => {
    const [responsabile, setResponsabile] = useState<Responsabile[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth()

    const fetchResponsabileByUtente = async (id_utente: string) => {
        setLoading(true);
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get(`http://127.0.0.1:5000/responsabile/utente/${id_utente}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento dei responsabili');
            }
            setResponsabile(response.data); // Imposta le medicazioni nello stato
            console.log(response.data)
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    }

    return { responsabile, loading, error, fetchResponsabileByUtente };
};

export default useResponsabile;
