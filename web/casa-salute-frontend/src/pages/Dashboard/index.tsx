import React, { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Utente } from '@/hooks/type';
import SegretariaDashboard from '@/pages/Dashboard/segretaria'
import PazienteDashboard from '@/pages/Dashboard/paziente'
import MedicoDashboard from '@/pages/Dashboard/medico'
import InfermiereDashboard from '@/pages/Dashboard/infermiere'
import { Toaster } from "@/components/ui/toaster";

import { UserAuth } from '@/hooks/useAuth';
import ResponsabilePage from '@/pages/Dashboard/responsabile';

interface Props {
  utente: Utente;
}

const Dashboard: React.FC = () => {
  const {user} = useAuth();
  const [utente, setUtente] = useState<Utente | null>(null);
  const [Page, setPage] = useState<React.FC<Props> | null>(null);

  const getUser = (user: UserAuth | null) => {
    if (!user) return;
    
    axios.get(`http://127.0.0.1:5000/utente/${user?.utente}`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
      .then(response => {
        setUtente(response.data)
      })
      .catch(error => {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Sessione scaduta."
        });
        console.error('Si è verificato un errore:', error);
      });
  };

  useEffect(() => {
    if(user) {
      getUser(user);

      let Component: React.FC<Props> | null = null;

      switch (user.ruolo) {
        case 'segretaria':
          Component = SegretariaDashboard;
          break;
        case 'infermiere':
          Component = InfermiereDashboard;
          break;
        case 'medico':
          Component = MedicoDashboard;
          break;
        case 'paziente':
          Component = PazienteDashboard;
          break
        case 'responsabile':
          Component = ResponsabilePage;
          break;
        default:
          Component = () => <div>Ruolo non riconosciuto</div>;
      }
      setPage(() => Component);

    }
  }, []);

  
  return (
    <div>
      {Page && utente ? <><Page utente={utente} /><Toaster /></> : <div>Caricamento...</div>}
    </div>
  )
}

export default Dashboard;
