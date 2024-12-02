import { useState, useEffect, useCallback } from "react";
import { Assenza, ServizioSala, TipoSala } from "./type";
import axios from "axios";
import { useAuth } from "./useAuth";

export interface UseTipoSalaHook {
    tipisala: TipoSala[];
    availableTimesInTipoSala: string[]
    loading: boolean;
    error: string | null;
    fetchAllTipiSala: () => Promise<void>;
    fetchVisitTimesByTipoSala: (data: string, id_tiposala: string) => Promise<void>
}

const useTipoSala = (): UseTipoSalaHook => {
    const [tipisala, setTipiSala] = useState<TipoSala[]>([]);
    const [availableTimesInTipoSala, setAvailableTimesInTipoSala] = useState<string[]>([
        '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', 
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth()

    const fetchVisitTimesByTipoSala = useCallback(async (data: string, id_tiposala: string) => {
        setAvailableTimesInTipoSala([])
        try {
            const response = await axios.get(`http://127.0.0.1:5000/prelievimedicazioni/available/tiposala/${id_tiposala}`, {
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
            setAvailableTimesInTipoSala(response.data)
            setLoading(false); 
        } catch (error: any) {
            setError(error.message); 
            setLoading(false);
        }
    }, []);

    const fetchAllTipiSala = async () => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/tipisala',
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento dei servizi sala');
            }
            setTipiSala(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };

    return { tipisala, availableTimesInTipoSala, loading, error, fetchAllTipiSala, fetchVisitTimesByTipoSala };
};

export default useTipoSala;
