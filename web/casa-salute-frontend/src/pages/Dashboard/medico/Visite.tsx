import { Medico, Visit } from "@/hooks/type";
import useVisit from "@/hooks/useVisit";
import { useEffect, useState } from "react";
import { convertToISO8601 } from '@/lib/utils';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VisitForm } from "@/components/form/visit-medico-form";
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AddVisitForm } from "@/components/form/add-visit-form";

interface Props {
  currentMedico: Medico,
  addForm: boolean,
  setAddForm: React.Dispatch<React.SetStateAction<boolean>>
  setViewAdd: React.Dispatch<React.SetStateAction<boolean>>
}

const Visite: React.FC<Props> = ({ currentMedico, addForm, setAddForm, setViewAdd }) => {
  const { visite, loading: loading_visites, fetchVisitesByDoctor, fetchVisitesByDoctorDate } = useVisit();
  const [selected_visit, set_visit] = useState<Visit | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const selectDate = async (date: Date | undefined) => {
    setSelectedDate(date);

    if (date === undefined)
      await fetchVisitesByDoctor(currentMedico.id_medico)
    else {
      set_visit(null)
      const newdate = convertToISO8601(date)
      await fetchVisitesByDoctorDate(currentMedico.id_medico, newdate)
    }
  }

  const fetchData = async () => {
    await fetchVisitesByDoctor(currentMedico.id_medico);
  };

  useEffect(() => {
    setViewAdd(true)
    fetchData();
  }, [addForm])


  if (!addForm) {
    return (
      <div className='w-full grid grid-cols-[repeat(4,_1fr)] grid-rows-[repeat(3,_1fr)] gap-x-[0px] gap-y-[0px]'>

        <div className='[grid-area:1_/_1_/_4_/_4]'>
          <div className='p-10  w-[80%] m-auto min-h-full'>
            {selected_visit && <VisitForm visit={selected_visit} fetchData={fetchData} />}
          </div>
        </div>

        <div className='[grid-area:1_/_4_/_4_/_5]'>
          <div className='text-xl font-semibold tracking-tight min-h-full flex flex-col p-6 mt-2 bg-primary-foreground max-h-[1000px] overflow-y-scroll'>
            <div className="p-2 flex flex-row items-center justify-between">
              <p>Visite in programma</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={`${selectedDate ? "default" : "secondary"}`}>
                    <CalendarIcon className="p-1" />
                  </Button>
                </PopoverTrigger>
                {/* <FormDescription>Data inizio visita</FormDescription> */}
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date: Date | undefined) => selectDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>


            {!loading_visites && visite.map((visit) => (
              <Card key={visit.id_visita} className={`my-4 mx-2 cursor-pointer ${visit.id_visita === selected_visit?.id_visita ? 'bg-gray-200' : ''}`} onClick={() => set_visit(visit)}>
                <CardHeader className='p-2'>
                  <div className='w-full flex justify-between'>
                    <CardTitle className='text-[calc(7px+0.390625vw)] max-w-[60%] leading-tight overflow-hidden overflow-ellipsis whitespace-nowrap'>
                      {visit.paziente.utente.nome + " " + visit.paziente.utente.cognome}
                    </CardTitle>
                    <div className='text-[calc(7px+0.390625vw)] leading-tight'>
                      {visit.datainizio}
                    </div>
                  </div>

                  <CardTitle className='text-[calc(6px+0.390625vw)] !mt-0 text-gray-500 leading-[calc(6px+0.390625vw)]'>
                    {visit.medico.utente.nome}
                  </CardTitle>
                  <CardDescription className='text-xs flex flex-col'>
                    <p>{visit.esito ? `Esisto: ${visit.esito}` : ""}</p>
                    <p>{visit.regime ? `Regime: ${visit.regime}` : ""}</p>
                    <p>{visit.urgenza ? `Urgenza: ${visit.urgenza}` : ""}</p>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {<AddVisitForm currentMedico={currentMedico} setAddForm={setAddForm} />}
      </div>
    );
  }

}

export default Visite;
