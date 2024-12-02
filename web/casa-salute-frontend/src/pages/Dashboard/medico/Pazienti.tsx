import { DataTable } from "@/components/table/pazienti/data-table";
import { Paziente as PazienteTable, columns } from '@/components/table/pazienti/columns';
import { Medico, Paziente } from "@/hooks/type";
import usePaziente from "@/hooks/usePatient";
import { useCallback, useEffect, useState } from "react";

interface Props {
  currentMedico: Medico;
  setViewAdd: React.Dispatch<React.SetStateAction<boolean>>
}

const Pazienti: React.FC<Props> = ({ currentMedico, setViewAdd }) => {
  const { pazienti, fetchAllPazientiByMedico } = usePaziente();
  const [data, setData] = useState<PazienteTable[]>([]);

  const fetchData = async () => {
    await fetchAllPazientiByMedico(currentMedico.id_medico);
  };

  useEffect(() => {
    setViewAdd(false)
    fetchData()

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

  }, [pazienti.length])

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} originalData={pazienti} />
    </div>
  );
}

export default Pazienti;