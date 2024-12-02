import React, { useState, useEffect } from 'react';
import { Paziente as PazienteTable, columns } from '@/components/table/pazienti/columns';
import { DataTable } from '@/components/table/pazienti/data-table';
import { Paziente } from '@/hooks/type';
import usePaziente from '@/hooks/usePatient';

const Pazientipage: React.FC = () => {
  const { pazienti, fetchAllPazienti } = usePaziente();
  const [data, setData] = useState<PazienteTable[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllPazienti();
    };

    fetchData();
  }, [fetchAllPazienti]);

  useEffect(() => {
    // Trasformazione dei dati solo se pazienti ha dati
    if (pazienti.length > 0) {
      const pazientiTableData = pazienti.map((paziente: Paziente) => {
        return {
          id_paziente: paziente.id_paziente,
          nome: paziente.utente.nome,
          cognome: paziente.utente.cognome,
          codicesanitario: paziente.codicesanitario,
          data_nascita: paziente.utente.data,
          email: paziente.utente.email
        };
      });
      setData(pazientiTableData);
    }
  }, [pazienti]);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} originalData={pazienti}/>
    </div>
  );
};

export default Pazientipage
