
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn, convertToISO8601, formatData } from "@/lib/utils"
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
import { Medico, Visit } from "@/hooks/type"
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
import { useVisitContext } from "@/context/visitContext"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import useVisit from "@/hooks/useVisit"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

interface Props {
  visit: Visit;
  fetchData: () => void;
}

interface TimePickerProps {
  setDate: (date: Date | undefined) => void;
  selectedValue: string | undefined;
  setSelectedValue: (value: string | undefined) => void;
}

export const VisitForm: React.FC<Props> = ({ visit, fetchData }) => {
  const { medici, mediciSostituti, error, fetchMediciSostitutiByMedico, fetchAllMedici } = useDoctor();
  const { availableTimesInAmbulatorio, fetchVisitTimesByAmbulatorio } = useVisit()
  const [openDialog, setOpenDialog] = useState(false);
  const { updateVisita } = useVisitContext();
  const form = useForm<z.infer<typeof visitFormSchema>>({
    resolver: zodResolver(visitFormSchema)
  });
  const [timeDate, setTimeDate] = useState<Date>()
  const [open, setOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(visit?.medico);
  const [visitChange, setchange] = useState<boolean>(true)
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    setchange(false)
    setSelectedMedico(visit.medico)
    form.reset({
      medico: visit.medico,
      paziente: visit.paziente,
      datainizio: visit.datainizio ? new Date(visit.datainizio) : new Date(),
      regime: visit.regime ? visit.regime : '',
      esito: visit.esito ? visit.esito : '',
      urgenza: visit.urgenza || '',
      ambulatorio: visit.ambulatorio
    })

    setTimeDate(form.getValues().datainizio)
    fetchAvailableTimes()
    const fetchData = async () => {
      if (visit?.id_medico) {
        await fetchAllMedici();
        await fetchMediciSostitutiByMedico(visit.id_medico);
      }
    };

    fetchData();
    setchange(true)
  }, [visit]);

  const MedicoList = ({
    setOpen,
    setSelectedMedico,
  }: {
    setOpen: (open: boolean) => void;
    setSelectedMedico: (status: Medico | null) => void;
  }) => {
    return (
      <Command>
        <CommandInput placeholder="Filter medico..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {medici.filter((medico) =>
              mediciSostituti.some((s) => s.id_medicosostituto === medico.id_medico || s.id_medico === medico.id_medico)
            ).map((medico) => (
              <CommandItem
                key={medico.id_medico}
                value={`${medico.utente.nome || ''} ${medico.utente.cognome || ''}`}
                onSelect={(value) => {
                  setSelectedMedico(
                    medici.find((m) => `${m.utente.nome} ${m.utente.cognome}` === value) || null
                  );
                  setOpen(false);
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

  useEffect(() => {
    fetchAvailableTimes()
  }, [timeDate])

  const fetchAvailableTimes = async () => {
    if (timeDate && visit.ambulatorio) {
      const day = String(timeDate.getUTCDate()).padStart(2, '0');
      const month = String(timeDate.getUTCMonth() + 1).padStart(2, '0');
      const year = timeDate.getUTCFullYear();
      const data = `${year}-${month}-${day}`;
      await fetchVisitTimesByAmbulatorio(data, visit.ambulatorio?.id_tipoambulatorio);
    }
  };

  const TimePicker: React.FC<TimePickerProps> = ({ setDate, selectedValue, setSelectedValue }) => {
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

  // const handleEliminaClick = () => {
  //   console.log('Elimina');
  // };

  const handleSalvaClick = () => {
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: z.infer<typeof visitFormSchema>) => {
    
    const visitFormData = {
      id_paziente: values.paziente.id_paziente,
      id_medico: values.medico.id_medico,
      datainizio: convertToISO8601(values.datainizio),
      urgenza: values.urgenza,
      esito: values.esito,
      regime: values.regime,
      id_tipoambulatorio: visit.id_tipoambulatorio,
      id_tipovisita: null
    }; 

    await updateVisita(visit.id_visita, visitFormData);
    fetchData()
  };

  return (
    <div>
      {visitChange && <Form {...form}>
        <div className="w-[80%] space-y-8 flex flex-col bg-white p-4 shadow-md rounded-md">
          <div>
            <FormField
              control={form.control}
              name="medico"
              render={({ field }) => (
                <FormItem className="flex flex-col my-2">
                  <FormLabel>Medico</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[150px] justify-start">
                          {selectedMedico ? `${selectedMedico.utente.nome || ''} ${selectedMedico.utente.cognome || ''}` : 'Seleziona un medico'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <MedicoList setOpen={setOpen} setSelectedMedico={(medico) => {
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
              render={(field) => (
                <FormItem>
                  <FormLabel>Paziente</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="Paziente" value={`${visit?.paziente.utente.nome} ${visit?.paziente.utente.cognome}`} {...field} />
                  </FormControl>
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
                            formatData(field.value.getTime())
                          ) : (
                            <span>Scegli una data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          if (date) {
                            const newDate = new Date(date);
                            newDate.setDate(newDate.getDate() + 1);
                            setTimeDate(newDate);
                          }
                          fetchAvailableTimes();
                        }}
                        fromDate={new Date()}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <TimePicker
                          setDate={field.onChange}
                          selectedValue={selectedValue}
                          setSelectedValue={setSelectedValue}
                        />
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ambulatorio</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="Ambulatorio"
                      value={`${field.value?.tipo}`}
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
                    <Input placeholder="Regime" defaultValue={`${visit?.regime}`} {...field} />
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
                    <Input placeholder="Esito" defaultValue={`${visit?.esito}`} {...field} />
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
                    <Input placeholder="Urgenza" defaultValue={`${visit?.urgenza}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-5">
            <Dialog>
              {/* <DialogTrigger asChild>
                <Button className={`bg-[#334155]text-white hover:bg-[#4f5662]`} >Elimina</Button>
              </DialogTrigger> */}
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Vuoi eliminare la visita?</DialogTitle>
                  <DialogDescription>
                    Una volta cancellata non è possibile tornare indietro
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Annulla
                    </Button>
                  </DialogClose>
                  {/* <Button type="submit" onClick={() => { handleEliminaClick() }}>Conferma</Button> */}
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button type="submit" onClick={handleSalvaClick}>Salva</Button>
          </div>
        </div>
      </Form>}
    </div>
  );
}


