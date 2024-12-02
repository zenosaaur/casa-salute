import React, { useEffect, useState } from 'react';

import { Infermiere, Utente } from '@/hooks/type';
import { Topbar } from '@/components/topbar';
import Prelievi from './Prelievi';
import { Sidebar } from '@/components/sidebar';

import { PersonStanding, Apple, Mail, GitMerge } from "lucide-react";
import { InfermiereProvider } from '@/context/infermiereContext';
import useInfermiere from '@/hooks/useInfermiere';
import Servizio from './Servizio';


interface Props {
  utente: Utente;
}

const Dashboard: React.FC<Props> = ({ utente }) => {
  const { infermieri, infermiere, fetchInfermiereByUtente } = useInfermiere();

  const [currentPage, setCurrentPage] = useState<string>('prelievi');
  const [addForm, setAddForm] = useState<boolean>(false);
  const [currentInfermiere, setCurrentInfermiere] = useState<Infermiere>();
  const [viewAdd, setViewAdd] = useState<boolean>(true);

  const handlePageChange = (page: string) => {
    setAddForm(false)
    setCurrentPage(page);
  };

  const sidebarOptions = [
    { label: 'Prelievi / Medicazioni', icon: <Mail />, page: 'prelievi' },
    { label: 'Servizio Sala', icon: <Mail />, page: 'servizio' },
  ];

  useEffect(() => {
    if (!currentInfermiere) {
      const fetchInfermiere = async () => {
        await fetchInfermiereByUtente(utente.id_utente);
        setCurrentInfermiere(infermiere);
      };

      fetchInfermiere();
    }
  }, [fetchInfermiereByUtente, utente.id_utente, currentInfermiere])

  return (
    <div className='absolute top-0 left-0 w-full'>
      <div className='grid grid-cols-[repeat(5,_1fr)] grid-rows-[repeat(5,_1fr)] gap-x-[0px] gap-y-[0px]'>
        <div className='[grid-area:1_/_2_/_6_/_6] w-full min-h-screen p-10 border-2 border-sky-500'>
          <Topbar utente={utente} setAddForm={setAddForm} viewAdd={viewAdd} />
          {currentPage === 'prelievi' && currentInfermiere && <InfermiereProvider> <Prelievi currentInfermiere={currentInfermiere} addForm={addForm} setAddForm={setAddForm} setViewAdd={setViewAdd} /> </InfermiereProvider>}
          {currentPage === 'servizio' && currentInfermiere && <InfermiereProvider> <Servizio currentInfermiere={currentInfermiere} addForm={addForm} setAddForm={setAddForm} setViewAdd={setViewAdd} /> </InfermiereProvider>}
        </div>
        <div className='[grid-area:1_/_1_/_6_/_2]  w-full min-h-screen'>
          <Sidebar setPage={handlePageChange} currentPage={currentPage} options={sidebarOptions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
