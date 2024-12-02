import { useState, useEffect } from "react";
import { Assenza, ServizioSala } from "./type";
import axios from "axios";
import { useAuth } from "./useAuth";
import { ComboValue } from "@/lib/form-schema";
import { toast } from "@/components/ui/use-toast";

export interface UseServizioSalaHook {
    servizisala: ServizioSala[];
    serviziosala: ServizioSala | undefined;
    loading: boolean;
    error: string | null;
    fetchAllServiziSala: () => Promise<void>;
    fetchServizioSalaByInfermiere: (id_infermiere: string) => Promise<void>;
    addServizioSala: (serviziosala: any) => Promise<void>;
}

const useServizioSala = (): UseServizioSalaHook => {
    const [servizisala, setAssenze] = useState<ServizioSala[]>([]);
    const [serviziosala, setAssenza] = useState<ServizioSala>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth()

    const fetchAllServiziSala = async () => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/servizisala',
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
            setAssenze(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };

    const fetchServizioSalaByInfermiere = async (id_infermiere: string) => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get(`http://127.0.0.1:5000/servizisala/${id_infermiere}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento del servizio sala');
            }
            setAssenze(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };

    const addServizioSala = async (serviziosala: any) => {
        try {
            const response = await axios.post(`http://127.0.0.1:5000/serviziosala`, serviziosala, {
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`,
                    'Access-Control-Allow-Origin': true
                }
            });
            if (response.status !== 200) {
                toast({
                    variant: "destructive",
                    title: "Errore",
                    description: "Errore nella creazione del servizio sala: " + response.data.message
                })
                throw new Error('Errore nell\'aggiornamento del servizio sala');
            }
            toast({
                variant: "success",
                title: "Successo",
                description: "Servizio sala creata con successo"
            })
            setLoading(false);
            return response.data
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Errore nella creazione del servizio sala, oppure servizio sala già presente: "
            })
            setError(error.message);
            setLoading(false);
        }
    };

    return { servizisala, serviziosala, loading, error, fetchAllServiziSala, fetchServizioSalaByInfermiere, addServizioSala };
};

export default useServizioSala;
