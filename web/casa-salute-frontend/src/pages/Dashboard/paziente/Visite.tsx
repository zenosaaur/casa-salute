import React, { useState, useEffect } from 'react';
import { Visita as VisitaTable, columns } from '@/components/table/visite/columns';
import { DataTable } from '@/components/table/visite/data-table';
import { Visit } from '@/hooks/type';
import useVisit from '@/hooks/useVisit';
import { formatDataEurope } from "@/lib/utils";
const VisitePage: React.FC = () => {
  const { visite, fetchAllVisites, fetchVisitesByUser } = useVisit();
  const [data, setData] = useState<VisitaTable[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchVisitesByUser();
    };

    fetchData();
  }, [fetchVisitesByUser]);

  useEffect(() => {
    if (visite.length > 0) {
      console.log(visite[0])
      const visiteTableData = visite.map((visita: Visit) => ({
        id_visita: visita.id_visita,
        data: visita.datainizio,
        medico: `${visita.medico.utente.nome} ${visita.medico.utente.cognome}`,
        esito: visita.esito,
        ambulatorio: visita.ambulatorio.tipo
      }));
      setData(visiteTableData);
    }
  }, [visite]);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} originalData={visite} />
    </div>
  );
};

export default VisitePage
