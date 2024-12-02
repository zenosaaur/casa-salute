import { useState, useEffect } from "react";
import { Ambulatorio, Medico, MedicoSostituto } from "./type";
import axios from "axios";
import { useAuth } from "./useAuth";
import { ComboValue } from "@/lib/form-schema";

export interface UseTipoAmbulatorioHook {
    tipiAmbulatorio: Ambulatorio[];
    tipoAmbulatorio: Ambulatorio | undefined;
    loading: boolean;
    error: string | null;
    fetchAllTipiAmbulatori: () => Promise<void>;
    fetchTipoAmbulatorioByMedico: (id_medico: string | undefined) => Promise<void>;
}

const useTipoAmbulatorio= (): UseTipoAmbulatorioHook => {
    const [tipiAmbulatorio, setTipiAmbulatorio] = useState<Ambulatorio[]>([]);
    const [tipoAmbulatorio, setTipoAmbulatorio] = useState<Ambulatorio>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth()

    const fetchAllTipiAmbulatori = async () => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/tipiambulatorio',
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento degli ambulatori');
            }
            setTipiAmbulatorio(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };

    const fetchTipoAmbulatorioByMedico = async (id_medico: string | undefined) => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/tipoambulatorio/medico/'+id_medico,
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
            setTipoAmbulatorio(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };
    
    return { tipiAmbulatorio, tipoAmbulatorio, loading, error, fetchTipoAmbulatorioByMedico, fetchAllTipiAmbulatori };
};

export default useTipoAmbulatorio;
