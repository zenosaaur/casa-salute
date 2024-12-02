import React, { useEffect, useState } from 'react';

import { Medico, Utente } from '@/hooks/type';
import { Topbar } from '@/components/topbar';
import Visite from './Visite';
import { Sidebar } from '@/components/sidebar';

import { BriefcaseMedical, Hospital,CalendarX } from "lucide-react";
import { DoctorProvider } from '@/context/doctorContext';
import useDoctor from '@/hooks/useDoctor';
import Pazienti from './Pazienti';
import Assenze from './Assenze';


interface Props {
  utente: Utente;
}


const Dashboard: React.FC<Props> = ({ utente }) => {
  const { medici, medico, loading: loading_visites, error, fetchMedicoByUtente } = useDoctor();

  const [currentPage, setCurrentPage] = useState<string>('visite');
  const [addForm, setAddForm] = useState<boolean>(false);
  const [viewAdd, setViewAdd] = useState<boolean>(true);
  const [currentMedico, setCurrentMedico] = useState<Medico>();

  const handlePageChange = (page: string) => {
    setAddForm(false);
    setCurrentPage(page);
  };

  const sidebarOptions = [
    { label: 'Visite', icon: <Hospital />, page: 'visite' },
    { label: 'Pazienti', icon: <BriefcaseMedical />, page: 'pazienti' },
    { label: 'Assenze', icon: <CalendarX />, page: 'assenze' },
  ];

  useEffect(() => {
    if (!currentMedico) {
      const fetchMedico = async () => {
        await fetchMedicoByUtente(utente.id_utente);
        setCurrentMedico(medico);
      };
  
      fetchMedico();
    }
  }, [fetchMedicoByUtente, utente.id_utente, currentMedico])


  return (
    <div className='absolute top-0 left-0 w-full'>
      <div className='grid grid-cols-[repeat(5,_1fr)] grid-rows-[repeat(5,_1fr)] gap-x-[0px] gap-y-[0px]'>
        <div className='[grid-area:1_/_2_/_6_/_6] w-full min-h-screen p-10 border-2 border-sky-500'>
          <Topbar utente={utente} setAddForm={setAddForm} viewAdd={viewAdd} />
          {currentPage === 'visite' && currentMedico && <DoctorProvider> <Visite currentMedico={currentMedico} addForm={addForm} setAddForm={setAddForm} setViewAdd={setViewAdd}/> </DoctorProvider>}
          {currentPage === 'pazienti' && currentMedico && <DoctorProvider> <Pazienti currentMedico={currentMedico} setViewAdd={setViewAdd}/> </DoctorProvider>}
          {currentPage === 'assenze' && currentMedico && <DoctorProvider> <Assenze currentMedico={currentMedico} addForm={addForm} setAddForm={setAddForm} setViewAdd={setViewAdd}/> </DoctorProvider>}
        </div>
        <div className='[grid-area:1_/_1_/_6_/_2]  w-full min-h-screen'>
          <Sidebar setPage={handlePageChange} currentPage={currentPage} options={sidebarOptions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
