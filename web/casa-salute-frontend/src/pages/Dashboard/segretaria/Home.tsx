import { useState, useEffect } from 'react';
import { CalendarForm } from '@/components/form/calendar-form';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardDescription } from '@/components/ui/card';
import { VisitForm } from '@/components/form/visit-segretaria-form';
import { MedicationForm } from '@/components/form/medication-segreteria-form';
import { useMedicationContext } from '@/context/medicationContext';
import { Visit, PrelieviMedicazioni, PrelievoMedicazione, Medico, Infermiere } from '@/hooks/type';
import { useVisitContext } from '@/context/visitContext';
import { convertToISO8601, formatData } from '@/lib/utils';
import { Tabs } from '@radix-ui/react-tabs';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar";
import useDoctor from '@/hooks/useDoctor';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import useInfermiere from '@/hooks/useInfermiere';
import { AddVisitForm } from '@/components/form/add-visit-form';
import { AddMedicazioneForm } from '@/components/form/add-medicazione-form';


const Home: React.FC = () => {
  const { visite, loading: loading_visites, fetchAllVisites, fetchVisitesByDate, fetchVisitesByDoctor } = useVisitContext(); // Otteniamo le visite e i relativi stati
  const { medici, fetchAllMedici } = useDoctor()
  const { medications, fetchAllMedications, fetchMedicationsByInfermiere, fetchMedicationsByData } = useMedicationContext();
  const { infermieri, fetchInfermieri } = useInfermiere()
  const [selected_visit, set_visit] = useState<Visit>();
  const [selected_medication, set_medication] = useState<PrelievoMedicazione>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>();
  const [openMedico, setOpenMedico] = useState(false);
  const [selectedInfermiere, setSelectedInfermiere] = useState<Infermiere | null>();
  const [openInfermiere, setOpenInfermiere] = useState(false);
  const [addForm, setAddForm] = useState<boolean>(false);
  const [typeForm, setTypeForm] = useState<'visita' | 'medicazione'>();

  const fetchVisite = async (id_medico: string) => {
    fetchVisitesByDoctor(id_medico)
  }

  const fetchPrelievi = async (id_inf: string) => {
    fetchMedicationsByInfermiere(id_inf)
  }

  const selectDate = async (date: Date | undefined) => {
    setSelectedDate(date);

    if (date === undefined) {
      await fetchAllVisites()
      await fetchAllMedications()
    } else {
      const newdate = convertToISO8601(date)
      if (newdate) {
        console.log(newdate)
        await fetchVisitesByDate(newdate)
        await fetchMedicationsByData(newdate)
      }
    }
  }

  const fetchData = async () => {
    await fetchAllVisites();
    await fetchAllMedici();
    await fetchAllMedications();
    await fetchInfermieri();
  };

  useEffect(() => {
    fetchData();
  }, [addForm])

  useEffect(() => {
    fetchData();
  }, [])

  const MedicoList = ({
    setOpenMedico,
    setSelectedMedico,
  }: {
    setOpenMedico: (open: boolean) => void;
    setSelectedMedico: (status: Medico | null) => void;
  }) => {
    return (
      <Command>
        <CommandInput placeholder="Filter medico..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {
              medici.map((medico) => (
                <CommandItem
                  key={medico.id_medico}
                  value={`${medico.utente.nome || ''} ${medico.utente.cognome || ''}`}
                  onSelect={(value) => {
                    setSelectedMedico(
                      medici.find((m) => `${m.utente.nome} ${m.utente.cognome}` === value) || null
                    );
                    fetchVisite(medico.id_medico)
                    setOpenMedico(false)
                  }}
                >
                  {`${medico.utente.nome || ''} ${medico.utente.cognome || ''}`}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  const InfermiereList = ({
    setOpenInfermiere,
    setSelectedInfermiere,
  }: {
    setOpenInfermiere: (open: boolean) => void;
    setSelectedInfermiere: (status: Infermiere | null) => void;
  }) => {
    return (
      <Command>
        <CommandInput placeholder="Filter infermiere..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {
              infermieri.map((infermiere) => (
                <CommandItem
                  key={infermiere.id_infermiere}
                  value={`${infermiere.utente.nome || ''} ${infermiere.utente.cognome || ''}`}
                  onSelect={(value) => {
                    setSelectedInfermiere(
                      infermieri.find((m) => `${m.utente.nome} ${m.utente.cognome}` === value) || null
                    );
                    fetchPrelievi(infermiere.id_infermiere)
                    setOpenInfermiere(false)
                  }}
                >
                  {`${infermiere.utente.nome || ''} ${infermiere.utente.cognome || ''}`}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  return (
    <div className='w-full grid grid-cols-[repeat(4,_1fr)] grid-rows-[repeat(3,_1fr)] gap-x-[0px] gap-y-[0px]'>
      <div className='[grid-area:1_/_1_/_4_/_4]'>
        {selected_visit &&
          <div className='p-10  w-[80%] m-auto min-h-full'>
            <VisitForm visit={selected_visit} fetchData={fetchData} />
          </div>
          || selected_medication &&
          <div className='p-10  w-[80%] m-auto min-h-full'>
            <MedicationForm medication={selected_medication} fetchData={fetchData} />
          </div>
        }
        {
          addForm && typeForm === 'visita' && <div className='p-10  w-[80%] m-auto min-h-full'>
            {addForm && <AddVisitForm currentMedico={undefined} setAddForm={setAddForm} />}
          </div>
        }
        {
          addForm && typeForm === 'medicazione' && <div className='p-10  w-[80%] m-auto min-h-full'>
            {addForm && <AddMedicazioneForm currentInfermiere={undefined} setAddForm={setAddForm} />}
          </div>
        }
      </div>
      <div className='[grid-area:1_/_4_/_5_/_5]'>
        <div className='text-xl font-semibold tracking-tight max-h-[80vh] flex flex-col p-6 mt-2 bg-primary-foreground overflow-y-scroll'>
          <div className="p-2 flex flex-row items-center justify-between">
            <p>Programma</p>
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

          <Tabs defaultValue="visite" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visite">Visite</TabsTrigger>
              <TabsTrigger value="medicazioni">Medicazioni/Prelievi</TabsTrigger>
            </TabsList>
            <TabsContent value="visite">
              <div className='flex justify-between'>
                <Popover open={openMedico} onOpenChange={setOpenMedico}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[150px] justify-start">
                      {selectedMedico ? `${selectedMedico.utente.nome || ''} ${selectedMedico.utente.cognome || ''}` : 'Filtra per medico'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <MedicoList setOpenMedico={setOpenMedico} setSelectedMedico={(medico) => {
                      setSelectedMedico(medico);
                      // field.onChange(medico);
                    }} />
                  </PopoverContent>
                </Popover>
                <Button variant="outline" className="w-[150px] justify-center" onClick={() => { set_medication(undefined); set_visit(undefined); setAddForm(true); setTypeForm('visita') }}>
                  Aggiungi
                </Button>
              </div>
              {!loading_visites && visite && visite.map((visita) => (
                <Card key={visita.id_visita} className={`my-4 mx-2 cursor-pointer ${visita.id_visita === selected_visit?.id_visita ? 'bg-gray-200' : ''}`} onClick={() => { set_visit(visita); set_medication(undefined); setAddForm(false); }}>
                  <CardHeader className='p-2'>
                    <div className='w-full flex justify-between'>
                      <CardTitle className='text-[calc(7px+0.390625vw)] max-w-[60%] leading-tight overflow-hidden overflow-ellipsis whitespace-nowrap'>
                        {visita.paziente.utente.nome + " " + visita.paziente.utente.cognome}
                      </CardTitle>
                      <div className='text-[calc(7px+0.390625vw)] leading-tight'>
                        {visita.datainizio}
                      </div>
                    </div>

                    <CardTitle className='text-[calc(6px+0.390625vw)] !mt-0 text-gray-500 leading-[calc(6px+0.390625vw)]'>
                      {visita.medico.utente.nome}
                    </CardTitle>
                    <CardDescription className='text-xs'>
                      <p>{visita.esito ? `Esisto: ${visita.esito}` : ""}</p>
                      <p>{visita.regime ? `Regime: ${visita.regime}` : ""}</p>
                      <p>{visita.urgenza ? `Urgenza: ${visita.urgenza}` : ""}</p>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="medicazioni">
              <div className='flex justify-between'>
                <Popover open={openInfermiere} onOpenChange={setOpenInfermiere}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[150px] justify-start">
                      {selectedInfermiere ? `${selectedInfermiere.utente.nome || ''} ${selectedInfermiere.utente.cognome || ''}` : 'Filtra per infermiere'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <InfermiereList setOpenInfermiere={setOpenInfermiere} setSelectedInfermiere={(infermiere) => {
                      setSelectedInfermiere(infermiere);
                      // field.onChange(medico);
                    }} />
                  </PopoverContent>
                </Popover>
                <Button variant="outline" className="w-[150px] justify-center" onClick={() => { set_medication(undefined); set_visit(undefined); setAddForm(true); setTypeForm('medicazione') }}>
                  Aggiungi
                </Button>
              </div>
              <div>Medicazioni</div>
              {medications && medications.medicazioni && medications.medicazioni.map((medicazione, index) => (
                <Card key={medicazione.id_prelievimedicazioni} className={`my-4 mx-2 cursor-pointer ${medicazione.id_prelievimedicazioni === selected_medication?.id_prelievimedicazioni ? 'bg-gray-200' : ''}`} onClick={() => { set_medication(medicazione); set_visit(undefined); setAddForm(false); }}>
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
                    <CardDescription className='text-xs'>
                      <p>{medicazione.note ? `Note: ${medicazione.note}` : ""}</p>
                      <p>{medicazione.esito ? `Esito: ${medicazione.esito}` : ""}</p>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}

              <div>Prelievi</div>
              {medications && medications.prelievi && medications.prelievi.map((prelievo, index) => (
                <Card key={prelievo.id_prelievimedicazioni} className={`my-4 mx-2 cursor-pointer ${prelievo.id_prelievimedicazioni === selected_medication?.id_prelievimedicazioni ? 'bg-gray-200' : ''}`} onClick={() => set_medication(prelievo)}>
                  <CardHeader className='p-2'>
                    <div className='w-full flex justify-between'>
                      <CardTitle className='text-[calc(7px+0.390625vw)] max-w-[60%] leading-tight overflow-hidden overflow-ellipsis whitespace-nowrap'>
                        {prelievo.paziente.utente.nome + " " + prelievo.paziente.utente.cognome}
                      </CardTitle>
                      <div className='text-[calc(7px+0.390625vw)] leading-tight'>
                        {prelievo.datainizio}
                      </div>
                    </div>

                    <CardTitle className='text-[calc(6px+0.390625vw)] !mt-0 text-gray-500 leading-[calc(6px+0.390625vw)]'>
                      {prelievo.infermiere.utente.nome}
                    </CardTitle>
                    <CardDescription className='text-xs'>
                      <p>{prelievo.note ? `Note: ${prelievo.note}` : ""}</p>
                      <p>{prelievo.esito ? `Esito: ${prelievo.esito}` : ""}</p>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}

            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div >
  );
}

export default Home;
