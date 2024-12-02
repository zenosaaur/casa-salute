import { Button } from "@/components/ui/button";
import { Infermiere, PrelievoMedicazione } from "@/hooks/type";
import useMedication from "@/hooks/useMedication";
import { convertToISO8601 } from "@/lib/utils";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar";
import { PopoverContent } from "@/components/ui/popover";
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MedicazioneForm } from "@/components/form/medicazione-infermiere-form";
import { AddMedicazioneForm } from "@/components/form/add-medicazione-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
interface Props {
  currentInfermiere: Infermiere,
  addForm: boolean,
  setAddForm: React.Dispatch<React.SetStateAction<boolean>>
  setViewAdd: React.Dispatch<React.SetStateAction<boolean>>
}

const Prelievi: React.FC<Props> = ({ currentInfermiere, addForm, setAddForm, setViewAdd }) => {
  const { medications, loading: loading_medicazioni, fetchMedicationsByInfermiere, fetchMedicationsByInfermiereDate } = useMedication();

  const [selected_medicazione, set_medicazione] = useState<PrelievoMedicazione | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const selectDate = async (date: Date | undefined) => {
    setSelectedDate(date);

    if (date === undefined)
      await fetchMedicationsByInfermiere(currentInfermiere.id_infermiere)
    else {
      set_medicazione(null)
      const newdate = convertToISO8601(date)
      await fetchMedicationsByInfermiereDate(currentInfermiere.id_infermiere, newdate)
    }
  }

  const fetchData = async () => {
    await fetchMedicationsByInfermiere(currentInfermiere.id_infermiere);
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
            {selected_medicazione && <MedicazioneForm medicazione={selected_medicazione} fetchData={fetchData} />}
          </div>
        </div>

        <div className='[grid-area:1_/_4_/_4_/_5]'>
          <div className='text-xl font-semibold tracking-tight min-h-full flex flex-col p-6 mt-2 bg-primary-foreground max-h-[1000px] overflow-y-scroll'>
            <div className="p-2 flex flex-row items-center justify-between">
              <p>Medicazioni/prelievi in programma</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={`${selectedDate ? "default" : "secondary"}`}>
                    <CalendarIcon className="p-1" />
                  </Button>
                </PopoverTrigger>
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

            <Tabs defaultValue="prelievi" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prelievi">Prelievi</TabsTrigger>
                <TabsTrigger value="medicazioni">Medicazioni</TabsTrigger>
              </TabsList>
              <TabsContent value="prelievi">
                {!loading_medicazioni && medications && medications.prelievi.map((medicazione) => (
                  <Card key={medicazione.id_prelievimedicazioni} className={`my-4 mx-2 cursor-pointer ${medicazione.id_prelievimedicazioni === selected_medicazione?.id_prelievimedicazioni ? 'bg-gray-200' : ''}`} onClick={() => set_medicazione(medicazione)}>
                    <CardHeader className='p-2'>
                      <div className='w-full flex justify-between'>
                        <CardTitle className='text-[calc(7px+0.390625vw)] max-w-[60%] leading-tight overflow-hidden overflow-ellipsis whitespace-nowrap'>
                          {medicazione.paziente.utente.nome + " " + medicazione.paziente.utente.cognome}
                        </CardTitle>
                        <div className='text-[calc(7px+0.390625vw)] leading-tight'>
                          {medicazione.datainizio}
                        </div>
                      </div>

                      <CardTitle className='text-[calc(6px+0.390625vw)] !mt-0 text-gray-500 leading-[calc(6px+0.390625vw)]'>
                        {medicazione.infermiere.utente.nome}
                      </CardTitle>
                      <CardDescription className='text-xs flex flex-col'>
                        <p>{medicazione.esito ? `Esisto: ${medicazione.esito}` : ""}</p>
                        <p>{medicazione.note ? `Note: ${medicazione.note}` : ""}</p>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="medicazioni">
                {!loading_medicazioni && medications && medications.medicazioni.map((medicazione) => (
                  <Card key={medicazione.id_prelievimedicazioni} className={`my-4 mx-2 cursor-pointer ${medicazione.id_prelievimedicazioni === selected_medicazione?.id_prelievimedicazioni ? 'bg-gray-200' : ''}`} onClick={() => set_medicazione(medicazione)}>
                    <CardHeader className='p-2'>
                      <div className='w-full flex justify-between'>
                        <CardTitle className='text-[calc(7px+0.390625vw)] max-w-[60%] leading-tight overflow-hidden overflow-ellipsis whitespace-nowrap'>
                          {medicazione.paziente.utente.nome + " " + medicazione.paziente.utente.cognome}
                        </CardTitle>
                        <div className='text-[calc(7px+0.390625vw)] leading-tight'>
                          {medicazione.datainizio}
                        </div>
                      </div>

                      <CardTitle className='text-[calc(6px+0.390625vw)] !mt-0 text-gray-500 leading-[calc(6px+0.390625vw)]'>
                        {medicazione.infermiere.utente.nome}
                      </CardTitle>
                      <CardDescription className='text-xs flex flex-col'>
                        <p>{medicazione.esito ? `Esisto: ${medicazione.esito}` : ""}</p>
                        <p>{medicazione.note ? `Note: ${medicazione.note}` : ""}</p>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {<AddMedicazioneForm currentInfermiere={currentInfermiere} setAddForm={setAddForm} />}
      </div>
    )
  }
}

export default Prelievi;
