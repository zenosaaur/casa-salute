import { useCallback, useState } from 'react';
import { useAuth } from './useAuth';
import axios from 'axios';
import { Paziente, Infermiere, PrelieviMedicazioni } from './type';
import { toast } from '@/components/ui/use-toast';



export interface UseMedicationHook {
    medications: PrelieviMedicazioni | undefined;
    loading: boolean;
    fetchAllMedications: () => Promise<void>;
    fetchMedicationsByData: (data: string) => Promise<void>;
    fetchMedicationsByUtente: () => Promise<void>;
    fetchMedicationsByInfermiereDate: (id_medico: string, date: any) => Promise<void>;
    fetchMedicationsByInfermiere: (doctorId: string) => Promise<void>;
    addMedicazione: (medicazione: any) => Promise<void>;
    updateMedicazione: (id_medicazione: string, medicazione: any) => Promise<void>;
    error: string | null;
}

const useMedication = (): UseMedicationHook => {
    const [medications, setMedications] = useState<PrelieviMedicazioni>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();

    const fetchAllMedications = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/prelievimedicazioni', {
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`
                }
            });
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle medicazioni');
            }
            setMedications(response.data);
            setLoading(false);
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    }, [auth.user?.token]);


    const fetchMedicationsByUtente = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/prelievimedicazioni/utente/' + auth.user?.utente, {
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`
                }
            });
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle medicazioni');
            }
            setMedications(response.data);
            setLoading(false);
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    }, [auth.user?.token]);

    const fetchMedicationsByData = async (data: string) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/prelievimedicazioni/${data}`, {
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`
                }
            });
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle medicazioni del paziente');
            }
            setMedications(response.data);
            setLoading(false);
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchMedicationsByInfermiere = async (id_infermiere: string) => {
        try {
            // Esegui la chiamata al database o all'API per ottenere le medicazioni
            const response = await axios.get('http://127.0.0.1:5000/prelievimedicazioni/infermiere/' + id_infermiere,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.token}`,
                        'Access-Control-Allow-Origin': true
                    }
                });
            // Check if the response is not successful
            if (response.status !== 200) {
                toast({
                    variant: "destructive",
                    title: "Errore",
                    description: "Infermiere selezionato non ha effettuato nessuna medicazione o nessun prelievo"
                })
            }
            setMedications(response.data); // Imposta le medicazioni nello stato
            setLoading(false); // Imposta lo stato di caricamento su false
        } catch (error: any) {
            // toast({
            //     variant: "destructive",
            //     title: "Errore",
            //     description: "Infermiere selezionato non ha effettuato nessuna medicazione o nessun prelievo"
            // })
            setMedications(undefined)
            setError(error.message); // Gestisci gli errori
            setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
        }
    };

    const fetchMedicationsByInfermiereDate = async (id_infermiere: string, date: Date) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/prelievimedicazioni/infermieredata/${id_infermiere}`, {
                params: {
                    data: date
                },
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`,
                    'Access-Control-Allow-Origin': true
                }
            });
            if (response.status !== 200) {
                throw new Error('Errore nel caricamento delle medicazioni/prelievi, filtrate per infermiere');
            }
            setMedications(response.data);
            setLoading(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Nessuna medicazione o prelievo trovato"
            })
            setError(error.message);
            setLoading(false);
        }
    };

    const updateMedicazione = async (id_medicazione: string, medicazione: any) => {
        try {
            const response = await axios.put(`http://127.0.0.1:5000/prelievomedicazione/${id_medicazione}`, medicazione, {
                headers: {
                    Authorization: `Bearer ${auth.user?.token}`,
                    'Access-Control-Allow-Origin': true
                }
            });
            console.log(response.status)
            if (response.status != 200) {
                toast({
                    variant: "destructive",
                    title: "Errore",
                    description: "Errore nella modifica della medicazione/prelievo: " + response.data.message
                })
                throw new Error('Errore nell\'aggiornamento della medicazione/prelievo');
            }
            toast({
                variant: "success",
                title: "Successo",
                description: "Medicazione/prelievo aggiornato con successo"
            })
            setLoading(false);
            return response.data
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    const addMedicazione = async (medicazione: any) => {
        try {
            const response = await axios.post(`http://127.0.0.1:5000/prelievomedicazione`, medicazione, {
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
                throw new Error('Errore nell\'aggiornamento della medicazione/prelievo');
            }
            toast({
                variant: "success",
                title: "Successo",
                description: "Medicazione/prelievo creata con successo"
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

    return { medications, loading, error, fetchAllMedications, fetchMedicationsByData, fetchMedicationsByInfermiereDate, fetchMedicationsByInfermiere, updateMedicazione, addMedicazione, fetchMedicationsByUtente };
}

export default useMedication;
