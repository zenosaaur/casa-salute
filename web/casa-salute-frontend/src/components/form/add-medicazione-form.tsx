import { Infermiere, Paziente, TipoSala } from "@/hooks/type";
import useInfermiere from "@/hooks/useInfermiere";
import useMedication from "@/hooks/useMedication";
import usePaziente from "@/hooks/usePatient";
import { medicazioneFormSchema } from "@/lib/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn, convertToISO8601, formatDataUSA } from "@/lib/utils";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useTipoSala from "@/hooks/useTipoSala";

interface Props {
  setAddForm: React.Dispatch<React.SetStateAction<boolean>>,
  currentInfermiere: Infermiere | undefined
}

interface TimePickerProps {
  setDate: (date: Date | undefined) => void;
}

export const AddMedicazioneForm: React.FC<Props> = ({ setAddForm, currentInfermiere }) => {
  const { pazienti, fetchAllPazienti } = usePaziente();
  const { infermieri, fetchInfermieri } = useInfermiere()
  const { tipisala, availableTimesInTipoSala, fetchAllTipiSala, fetchVisitTimesByTipoSala } = useTipoSala()
  const { addMedicazione } = useMedication()
  const [timeDate, setTimeDate] = useState<Date>()

  const form = useForm<z.infer<typeof medicazioneFormSchema>>({
    resolver: zodResolver(medicazioneFormSchema),
    defaultValues: {
      infermiere: currentInfermiere ? currentInfermiere : undefined,
      paziente: undefined,
      datainizio: undefined,
      esito: undefined,
      note: undefined,
      premed: undefined
    }
  })

  const [openInfermiere, setOpenInfermiere] = useState(false);
  const [selectedInfermiere, setSelectedInfermiere] = useState<Infermiere | null>(currentInfermiere ? currentInfermiere : null);
  const [openPaziente, setOpenPaziente] = useState(false);
  const [selectedPaziente, setSelectedPaziente] = useState<Paziente | null>();

  const [openSala, setOpenSala] = useState(false);
  const [selectedSala, setSelectedSala] = useState<TipoSala | null>();

  const close = () => {
    form.reset();
    setAddForm(false)
  };

  const fetchData = async () => {
    await fetchInfermieri();
    await fetchAllPazienti();
    await fetchAllTipiSala()
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchAvailableTimes()
  }, [timeDate])

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
              currentInfermiere ?
                <CommandItem
                  key={currentInfermiere.id_infermiere}
                  value={`${currentInfermiere.utente.nome || ''} ${currentInfermiere.utente.cognome || ''}`}
                  onSelect={(value) => {
                    setSelectedInfermiere(currentInfermiere);
                    setOpenInfermiere(false);
                  }}
                >
                  {`${currentInfermiere.utente.nome || ''} ${currentInfermiere.utente.cognome || ''}`}
                </CommandItem>

                :

                infermieri.map((infermiere) => (
                  <CommandItem
                    key={infermiere.id_infermiere}
                    value={`${infermiere.utente.nome || ''} ${infermiere.utente.cognome || ''}`}
                    onSelect={(value) => {
                      setSelectedInfermiere(infermieri.find((i) => `${i.utente.nome} ${i.utente.cognome}` === value) || null
                      );
                      setOpenInfermiere(false);
                    }}
                  >
                    {`${infermiere.utente.nome || ''} ${infermiere.utente.cognome || ''}`}
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
        <CommandInput placeholder="Filter paziente..." />
        <CommandList>
          <CommandEmpty>Seleziona un paziente</CommandEmpty>
          <CommandGroup>
            {
              pazienti.map((paziente) => (
                <CommandItem
                  key={paziente.id_paziente}
                  value={`${paziente.utente.nome || ''} ${paziente.utente.cognome || ''}`}
                  onSelect={(value) => {
                    setSelectedPaziente(
                      pazienti.find((p) => `${p.utente.nome} ${p.utente.cognome}` === value) || null
                    );
                    setOpenPaziente(false);
                  }}
                >
                  {`${paziente.utente.nome || ''} ${paziente.utente.cognome || ''}`}
                </CommandItem>
              ))
            }
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  const SalaList = ({
    setOpenSala,
    setSelectedSala
  }: {
    setOpenSala: (open: boolean) => void;
    setSelectedSala: (status: TipoSala | null) => void;
  }) => {
    return (
      <Command>
        <CommandList>
          <CommandEmpty>Seleziona una sala</CommandEmpty>
          <CommandGroup>
            {
              tipisala.map((sala) => (
                <CommandItem
                  key={sala.id_tiposala}
                  value={`${sala.tipo || ''}`}
                  onSelect={(value) => {
                    setSelectedSala(
                      tipisala.find((p) => `${p.tipo}` === value) || null
                    );
                    setOpenSala(false);
                  }}
                >
                  {`${sala.tipo || ''}`}
                </CommandItem>
              ))
            }
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  const fetchAvailableTimes = async () => {
    if (timeDate && selectedSala) {
      const data = formatDataUSA(timeDate)
      await fetchVisitTimesByTipoSala(data, selectedSala?.id_tiposala);
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
            {availableTimesInTipoSala?.map((elm, index) => (
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

  const onSubmit = async (values: z.infer<typeof medicazioneFormSchema>) => {
    const medicazioneFormData = {
      id_paziente: values.paziente.id_paziente,
      id_infermiere: values.infermiere.id_infermiere,
      datainizio: convertToISO8601(values.datainizio),
      esito: values.esito,
      note: values.note,
      id_tiposala: values.premed
    };

    await addMedicazione(medicazioneFormData);
    close()
  };

  return (
    <div className="flex items-start justify-center pt-16">
      <Form {...form}>
        <div className="w-[80%] space-y-8 flex flex-col bg-white p-4 shadow-md rounded-md">
          <div>
            <FormField
              control={form.control}
              name="infermiere"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Infermiere</FormLabel>
                    <FormControl>
                      <Popover open={openInfermiere} onOpenChange={setOpenInfermiere}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[150px] justify-start">
                            {selectedInfermiere ? `${selectedInfermiere.utente.nome || ''} ${selectedInfermiere.utente.cognome || ''}` : 'Seleziona un infermiere'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <InfermiereList setOpenInfermiere={setOpenInfermiere} setSelectedInfermiere={(infermiere) => {
                            setSelectedInfermiere(infermiere);
                            field.onChange(infermiere);
                          }} />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
              name="premed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prelievo o Medicazione</FormLabel>
                  <FormControl>
                    <Popover open={openSala} onOpenChange={setOpenSala}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[150px] justify-start">
                          {selectedSala ? `${selectedSala.tipo || ''}` : 'Seleziona una sala'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <SalaList setOpenSala={setOpenSala} setSelectedSala={(sala) => {
                          setSelectedSala(sala);
                          field.onChange(sala?.id_tiposala);
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
                          setTimeDate(date)
                          field.onChange(date);
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
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Note"
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