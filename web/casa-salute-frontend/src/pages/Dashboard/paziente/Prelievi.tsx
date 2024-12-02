
import React, { useState, useEffect } from 'react';
import { Medication as MedicationTable, columns } from '@/components/table/medicazioni/columns';
import { DataTable } from '@/components/table/medicazioni/data-table';
import { PrelievoMedicazione } from '@/hooks/type';
import { formatDataEurope } from "@/lib/utils";
import useMedication from '@/hooks/useMedication';
const PrelieviPage: React.FC = () => {
  const [data, setData] = useState<MedicationTable[]>([]);
  const { medications, fetchMedicationsByUtente } = useMedication()
  useEffect(() => {
    const fetchData = async () => {
      await fetchMedicationsByUtente();
    };

    fetchData();
  }, [fetchMedicationsByUtente]);

  useEffect(() => {
    if (medications) {
      const medicationTableData = medications.map((medicazione: PrelievoMedicazione) => ({
        id_prelievimedicazioni: medicazione.id_prelievimedicazioni,
        data: medicazione.datainizio,
        infermiere: `${medicazione.infermiere.utente.nome} ${medicazione.infermiere.utente.cognome}`,
        esito: medicazione.esito,
      }));
      setData(medicationTableData);
    }
  }, [medications]);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} originalData={medications} />
    </div>
  );
};

export default PrelieviPage
