import { Assenza, Medico } from "@/hooks/type";
import { Assenza as AssenzaTable, columns } from '@/components/table/assenze/columns'
import { DataTable } from "@/components/table/assenze/data-table";
import useAssenza from "@/hooks/useAssenza";
import { useEffect, useState } from "react";

interface Props {
  currentMedico: Medico,
  addForm: boolean,
  setAddForm: React.Dispatch<React.SetStateAction<boolean>>
  setViewAdd: React.Dispatch<React.SetStateAction<boolean>>
}

const Assenze: React.FC<Props> = ({ currentMedico, setViewAdd }) => {
  const { assenze, fetchAssenzaByMedico } = useAssenza();
  const [data, setData] = useState<AssenzaTable[]>([]);


  useEffect(() => {
    setViewAdd(false)
    if (assenze.length > 0) {
      const assenzeTableData = assenze.map((assenza: Assenza) => {
        return {
          id_assenza: assenza.id_assenza,
          nome: assenza.medico.utente.nome,
          cognome: assenza.medico.utente.cognome,
          data: assenza.data,
        };
      });
      setData(assenzeTableData);
    }
  }, [assenze])

  useEffect(() => {
    const fetchData = async () => {
      await fetchAssenzaByMedico(currentMedico.id_medico);
    };

    fetchData();
  }, []);

    return (
      <div className='container mx-auto py-10'>
        <DataTable columns={columns} data={data} />
      </div>
    );

  
}

export default Assenze;