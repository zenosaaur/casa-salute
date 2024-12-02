import React, { useState, useEffect } from 'react';
import { Infermiere as InfermiereTable, columns } from "@/components/table/infermiere/columns"
import { DataTable } from '@/components/table/infermiere/data-table';
import { Infermiere } from '@/hooks/type';
import useInfermiere from '@/hooks/useInfermiere';
const Infermieripage: React.FC = () => {
  const { infermieri, fetchInfermieri } = useInfermiere();
  const [data, setData] = useState<InfermiereTable[]>([]);

  useEffect(() => {
    if (infermieri.length > 0) {
      const infermieriTableData = infermieri.map((infermiere: Infermiere) => {
        return {
          id_infermiere: infermiere.id_infermiere,
          nome: infermiere.utente.nome,
          cognome: infermiere.utente.cognome,
          codicefiscale: infermiere.utente.codicefiscale,
          data_nascita: infermiere.utente.data,
          email: infermiere.utente.email
        };
      });
      setData(infermieriTableData);
    }
  }, [infermieri]);


  useEffect(() => {
    const fetchData = async () => {
      await fetchInfermieri();
    };

    fetchData();
  }, []);
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} originalData={infermieri}/>
    </div>
  );
};

export default Infermieripage
