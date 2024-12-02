import { Infermiere, ServizioSala } from "@/hooks/type";
import { useEffect, useState } from "react";
import { ServizioSala as ServizioTable, columns } from '@/components/table/serviziosala/columns'
import { DataTable } from "@/components/table/serviziosala/data-table";
import { AddServizioSalaForm } from "@/components/form/add-serviziosala-form";
import useServizioSala from "@/hooks/useServizioSala";

interface Props {
  currentInfermiere: Infermiere,
  addForm: boolean,
  setAddForm: React.Dispatch<React.SetStateAction<boolean>>
  setViewAdd: React.Dispatch<React.SetStateAction<boolean>>
}

const Servizio: React.FC<Props> = ({ currentInfermiere, addForm, setAddForm, setViewAdd }) => {
  const { servizisala, fetchServizioSalaByInfermiere } = useServizioSala();
  const [data, setData] = useState<ServizioTable[]>([]);

  const fetchData = async () => {
    await fetchServizioSalaByInfermiere(currentInfermiere.id_infermiere);
  };

  useEffect(() => {
    setViewAdd(false)
    fetchData()

    const serviziTableData = servizisala.map((servizio: ServizioSala) => {
      return {
        id_serviziosala: servizio.id_serviziosala,
        nome: servizio.infermiere.utente.nome,
        cognome: servizio.infermiere.utente.cognome,
        data: servizio.data,
        sala: servizio.sala.tipo
      };
    });
    setData(serviziTableData);

  }, [servizisala.length, addForm])

  // if (!addForm) {
  //   return (
  //     <div className='container mx-auto py-10'>
  //       <DataTable columns={columns} data={data} />
  //     </div>
  //   );
  // } else {
  //   return (
  //     <div>
  //       {<AddServizioSalaForm currentInfermiere={currentInfermiere} setAddForm={setAddForm} />}
  //     </div>
  //   );
  // }
  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default Servizio;
