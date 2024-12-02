import { useState } from "react";
import { Assenza } from "./type";
import axios from "axios";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/use-toast";
import { convertToISO8601 } from "@/lib/utils";

export interface UseAssenzaHook {
  assenze: Assenza[];
  assenza: Assenza | undefined;
  loading: boolean;
  error: string | null;
  fetchAllAssenze: () => Promise<void>;
  fetchAssenzaByMedico: (id_medico: string) => Promise<void>;
  fetchAssenzaByMedicoAndDate: (id_medico: string, date: Date) => Promise<void>;
  addAssenza: (assenza: any) => Promise<void>;
}

const useAssenza = (): UseAssenzaHook => {
  const [assenze, setAssenze] = useState<Assenza[]>([]);
  const [assenza, setAssenza] = useState<Assenza>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  const fetchAllAssenze = async () => {
    try {
      // Esegui la chiamata al database o all'API per ottenere le medicazioni
      const response = await axios.get("http://127.0.0.1:5000/assenze", {
        headers: {
          Authorization: `Bearer ${auth.user?.token}`,
          "Access-Control-Allow-Origin": true,
        },
      });
      // Check if the response is not successful
      if (response.status !== 200) {
        throw new Error("Errore nel caricamento delle assenze");
      }
      setAssenze(response.data); // Imposta le medicazioni nello stato
      setLoading(false); // Imposta lo stato di caricamento su false
    } catch (error: any) {
      setError(error.message); // Gestisci gli errori
      setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
    }
  };

  const fetchAssenzaByMedico = async (id_medico: string) => {
    setAssenze([])
    try {
      // Esegui la chiamata al database o all'API per ottenere le medicazioni
      const response = await axios.get(
        `http://127.0.0.1:5000/assenze/${id_medico}`,
        {
          headers: {
            Authorization: `Bearer ${auth.user?.token}`,
            "Access-Control-Allow-Origin": true,
          },
        }
      );
      // Check if the response is not successful
      if (response.status !== 200) {
        throw new Error("Errore nel caricamento delle assenze");
      }
      setAssenze(response.data); // Imposta le medicazioni nello stato
      setLoading(false); // Imposta lo stato di caricamento su false
    } catch (error: any) {
      setError(error.message); // Gestisci gli errori
      setLoading(false); // Imposta lo stato di caricamento su false anche in caso di errore
    }
  };

  const fetchAssenzaByMedicoAndDate = async (id_medico: string, date: Date) => {
    setLoading(true);
    setError(null);
    try {
      // Esegui la chiamata al database o all'API per ottenere le medicazioni
      const response = await axios.get(
        `http://127.0.0.1:5000/assenze/${id_medico}/${convertToISO8601(date)}`,
        {
          headers: {
            Authorization: `Bearer ${auth.user?.token}`,
            "Access-Control-Allow-Origin": true,
          },
        }
      );
      // Check if the response is not successful
      if (response.status !== 200) {
        throw new Error("Errore nel caricamento delle assenze");
      }
      setAssenza(response.data);
    } catch (error: any) {
        setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const addAssenza = async (assenza: any) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/assenza`,
        assenza,
        {
          headers: {
            Authorization: `Bearer ${auth.user?.token}`,
            "Access-Control-Allow-Origin": true,
          },
        }
      );
      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: response.data.message,
        });
        throw new Error("Errore nell'aggiornamento dell'assenza");
      }
      toast({
        variant: "success",
        title: "Successo",
        description: "Assenza creata con successo",
      });
      setLoading(false);
      return response.data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: error.response.data.message,
      });
      setError(error.message);
      setLoading(false);
    }
  };

  return {
    assenze,
    assenza,
    loading,
    error,
    fetchAllAssenze,
    fetchAssenzaByMedico,
    addAssenza,
    fetchAssenzaByMedicoAndDate,
  };
};

export default useAssenza;
