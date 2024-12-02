import React, { useState, useEffect } from 'react';
import { Medico as MedicoTable, columns } from '@/components/table/medici/columns';
import { DataTable } from '@/components/table/medici/data-table';
import { Medico } from '@/hooks/type';
import useDoctor from '@/hooks/useDoctor';
const Medicipage: React.FC = () => {
  const { medici, fetchAllMedici } = useDoctor();
  const [data, setData] = useState<MedicoTable[]>([]);

  useEffect(() => {
    if (medici.length > 0) {
      const mediciTableData = medici.map((medico: Medico) => {
        return {
          id_medico: medico.id_medico,
          nome: medico.utente.nome,
          cognome: medico.utente.cognome,
          codicefiscale: medico.utente.codicefiscale,
          email: medico.utente.email,
          data_nascita: medico.utente.data
        };
      });
      setData(mediciTableData);
    }
  }, [medici]);


  useEffect(() => {
    const fetchData = async () => {
      await fetchAllMedici();
    };

    fetchData();
  }, [fetchAllMedici]);
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} originalData={medici} />
    </div>
  );
};

export default Medicipage
