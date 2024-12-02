"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn, convertToISO8601, formatDataUSA } from "@/lib/utils"
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription
} from "@/components/ui/form"
import { TimePickerDemo } from "@/components/time-picker"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Medico, MedicoSostituto, Paziente, Visit } from "@/hooks/type"
import { visitFormSchema } from "@/lib/form-schema"
import useDoctor from "@/hooks/useDoctor"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import usePaziente from "@/hooks/usePatient"
import useVisit from "@/hooks/useVisit"
import useTipoAmbulatorio from "@/hooks/useTipoAmbulatorio"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

interface Props {
  setAddForm: React.Dispatch<React.SetStateAction<boolean>>,
  currentMedico: Medico | undefined
}

interface TimePickerProps {
  setDate: (date: Date | undefined) => void;
}

export const AddVisitForm: React.FC<Props> = ({ setAddForm, currentMedico }) => {
  const { medici, mediciSostituti, error, fetchMediciSostitutiByMedico, fetchAllMedici } = useDoctor();
  const { availableTimesInAmbulatorio, fetchVisitTimesByAmbulatorio } = useVisit()
  const { tipoAmbulatorio, fetchTipoAmbulatorioByMedico } = useTipoAmbulatorio();
  const { pazienti, fetchAllPazientiByMedico } = usePaziente();
  const { addVisita } = useVisit();
  const [timeDate, setTimeDate] = useState<Date>()

  const form = useForm<z.infer<typeof visitFormSchema>>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      medico: currentMedico ? currentMedico : undefined,
      paziente: undefined,
      datainizio: undefined,
      regime: undefined,
      esito: undefined,
      urgenza: undefined,
      ambulatorio: undefined // ! se è un medico con un ambulatorio allora assegna, se è un medcio senza ambulatorio vai a prendere l'ambulatorio del medico che sostituisce
    },
  });

  const [openMedico, setOpenMedico] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(currentMedico ? currentMedico : null);

  const [openPaziente, setOpenPaziente] = useState(false);
  const [selectedPaziente, setSelectedPaziente] = useState<Paziente | null>();

  const close = () => {
    form.reset();
    setAddForm(false)
  };

  const fetchAmbulatorio = async (id_medico: string | undefined) => {
    await fetchTipoAmbulatorioByMedico(id_medico)
    if (tipoAmbulatorio) {
      form.setValue('ambulatorio', tipoAmbulatorio)

    }
  }

  const fetchPazienti = async (id_medico: string) => {
    await fetchAllPazientiByMedico(id_medico);
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllMedici();
      if (currentMedico) {
        await fetchAmbulatorio(currentMedico.id_medico)
        await fetchMediciSostitutiByMedico(currentMedico.id_medico);  // se add visit è invocata da un medico allora mostri i medici sostituti altrimenti mostri tutti i medici (nel caso della segretaria)
        await fetchPazienti(currentMedico.id_medico)
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchAvailableTimes()
  }, [timeDate])

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
            {currentMedico ?
              medici.filter((medico) =>
                mediciSostituti.some((s) => s.id_medicosostituto === medico.id_medico || s.id_medico === medico.id_medico)
              ).map((medico) => (
                <CommandItem
                  key={medico.id_medico}
                  value={`${medico.utente.nome || ''} ${medico.utente.cognome || ''}`}
                  onSelect={(value) => {
                    setSelectedMedico(
                      medici.find((m) => `${m.utente.nome} ${m.utente.cognome}` === value) || null
                    );
                    fetchPazienti(medico.id_medico)
                    setOpenMedico(false);
                  }}
                >
                  {`${medico.utente.nome || ''} ${medico.utente.cognome || ''}`}
                </CommandItem>
              )) :
              medici.map((medico) => (
                <CommandItem
                  key={medico.id_medico}
                  value={`${medico.utente.nome || ''} ${medico.utente.cognome || ''}`}
                  onSelect={(value) => {
                    setSelectedMedico(
                      medici.find((m) => `${m.utente.nome} ${m.utente.cognome}` === value) || null
                    );
                    fetchPazienti(medico.id_medico)
                    fetchAmbulatorio(medico.id_medico)
                    setOpenMedico(false);
                  }}
                >
                  {`${medico.utente.nome || ''} ${medico.utente.cognome || ''}`}
                </CommandItem>
              ))
            }
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  const PazienteList = ({
    setOpenPaziente,
    setSelectedPaziente,
  }: {
    setOpenPaziente: (open: boolean) => void;
    setSelectedPaziente: (status: Paziente | null) => void;
  }) => {
    return (
      <Command>
        <CommandInput placeholder="Filter medico..." />
        <CommandList>
          <CommandEmpty>Seleziona un medico</CommandEmpty>
          <CommandGroup>
            {
              selectedMedico ?
                pazienti.map((paziente) => (
                  <CommandItem
                    key={paziente.id_paziente}
                    value={`${paziente.utente.nome || ''} ${paziente.utente.cognome || ''}`}
                    onSelect={(value) => {
                      setSelectedPaziente(
                        pazienti.find((m) => `${m.utente.nome} ${m.utente.cognome}` === value) || null
                      );
                      setOpenPaziente(false);
                    }}
                  >
                    {`${paziente.utente.nome || ''} ${paziente.utente.cognome || ''}`}
                  </CommandItem>
                )) : null
            }
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  const fetchAvailableTimes = async () => {
    if (timeDate && tipoAmbulatorio) {
      const data = formatDataUSA(timeDate)
      await fetchVisitTimesByAmbulatorio(data, tipoAmbulatorio?.id_tipoambulatorio);
    }
  };

  const TimePicker: React.FC<TimePickerProps> = ({ setDate }) => {
    const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

    const handleSelectChange = (value: string) => {
      setSelectedValue(value);

      if (!timeDate) {
        const selectedTime = new Date();
        const [hours, minutes] = value.split(':');
        selectedTime.setHours(parseInt(hours, 10));
        selectedTime.setMinutes(parseInt(minutes, 10));
        setDate(selectedTime);
      } else {
        const updatedDate = new Date(timeDate);
        const [hours, minutes] = value.split(':');
        updatedDate.setHours(parseInt(hours, 10));
        updatedDate.setMinutes(parseInt(minutes, 10));
        setDate(updatedDate);
      }
    };

    return (
      <Select value={selectedValue} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Orario" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {availableTimesInAmbulatorio?.map((elm, index) => (
              <SelectItem
                key={index}
                value={elm}>
                {elm}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  const onSubmit = async (values: z.infer<typeof visitFormSchema>) => {
    fetchAmbulatorio(values.medico.id_medico)

    const visitFormData = {
      id_paziente: values.paziente.id_paziente,
      id_medico: values.medico.id_medico,
      datainizio: convertToISO8601(values.datainizio),
      urgenza: values.urgenza,
      esito: values.esito,
      regime: values.regime,
      id_tipoambulatorio: tipoAmbulatorio?.id_tipoambulatorio,
      id_tipovisita: undefined
    };

    await addVisita(visitFormData);
    close()
  };

  return (
    <div className="flex items-start justify-center pt-16">
      <Form {...form}>
        <div className="w-[80%] space-y-8 flex flex-col bg-white p-4 shadow-md rounded-md">
          <div>
            <FormField
              control={form.control}
              name="medico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medico</FormLabel>
                  <FormControl>
                    <Popover open={openMedico} onOpenChange={setOpenMedico}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[150px] justify-start">
                          {selectedMedico ? `${selectedMedico.utente.nome || ''} ${selectedMedico.utente.cognome || ''}` : 'Seleziona un medico'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <MedicoList setOpenMedico={setOpenMedico} setSelectedMedico={(medico) => {
                          setSelectedMedico(medico);
                          field.onChange(medico);
                        }} />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paziente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paziente</FormLabel>
                  <FormControl>
                    <Popover open={openPaziente} onOpenChange={setOpenPaziente}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[150px] justify-start">
                          {selectedPaziente ? `${selectedPaziente.utente.nome || ''} ${selectedPaziente.utente.cognome || ''}` : 'Seleziona un paziente'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <PazienteList setOpenPaziente={setOpenPaziente} setSelectedPaziente={(paziente) => {
                          setSelectedPaziente(paziente);
                          field.onChange(paziente);
                        }} />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="datainizio"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data inizio visita</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[220px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP HH:mm:ss")
                          ) : (
                            <span>Scegli una data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <FormDescription>Data inizio visita</FormDescription>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setTimeDate(date)
                          fetchAvailableTimes()
                        }}
                        fromDate={new Date()}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        {/* <TimePickerDemo
                          setDate={field.onChange}
                          date={field.value}
                          ambulatorio={tipoAmbulatorio?.id_tipoambulatorio}
                        /> */}
                        <TimePicker setDate={field.onChange} />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ambulatorio"
              render={() => (
                <FormItem>
                  <FormLabel>Ambulatorio</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="Seleziona un medico"
                      defaultValue={tipoAmbulatorio?.tipo}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regime</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Regime"
                      defaultValue={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="esito"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Esito</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Esito"
                      defaultValue={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urgenza"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgenza</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Urgenza"
                      defaultValue={field.value}
                      onChange={(e) => field.onChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-5">
            <Button variant={"secondary"} onClick={close}>Annulla</Button>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Salva</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}


