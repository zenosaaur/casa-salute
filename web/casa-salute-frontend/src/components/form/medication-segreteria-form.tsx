"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn, convertToISO8601 } from "@/lib/utils"
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
import { PrelievoMedicazione, Infermiere } from "@/hooks/type"
import { medicazioneFormSchema } from "@/lib/form-schema"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useMedicationContext } from "@/context/medicationContext"
import useInfermiere from "@/hooks/useInfermiere"
import useTipoSala from "@/hooks/useTipoSala"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

interface Props {
  medication: PrelievoMedicazione;
  fetchData: () => void;
}

interface TimePickerProps {
  setDate: (date: Date | undefined) => void;
}

export const MedicationForm: React.FC<Props> = ({ medication, fetchData }) => {
  const { infermieri, fetchInfermieri } = useInfermiere();
  const { updateMedicazione } = useMedicationContext();
  const [open, setOpen] = useState(false);
  const [timeDate, setTimeDate] = useState<Date>()
  const [selectedInfermiere, setSelectedInfermiere] = useState<Infermiere | null>(medication?.infermiere);
  const { availableTimesInTipoSala, fetchVisitTimesByTipoSala } = useTipoSala()
  const [openDialog, setOpenDialog] = useState(false);
  const [prevmedChange, setchange] = useState<boolean>(true)

  const form = useForm<z.infer<typeof medicazioneFormSchema>>({
    resolver: zodResolver(medicazioneFormSchema)
  });

  useEffect(() => {
    fetchAvailableTimes()
  }, [timeDate])

  useEffect(() => {
    setchange(false)
    form.reset({
      infermiere: medication.infermiere,
      paziente: medication.paziente,
      datainizio: medication.datainizio ? new Date(medication.datainizio) : new Date(),
      note: medication.note || '',
      esito: medication.esito || '',
    });
    setTimeDate(form.getValues().datainizio)
    const fetchData = async () => {
      await fetchInfermieri();
    };
    fetchAvailableTimes()
    setSelectedInfermiere(medication?.infermiere)
    fetchData();
    setchange(true)
  }, [medication]);

  const fetchAvailableTimes = async () => {
    if (timeDate && medication.id_tiposala) {
      const day = String(timeDate.getUTCDate()).padStart(2, '0');
      const month = String(timeDate.getUTCMonth() + 1).padStart(2, '0');
      const year = timeDate.getUTCFullYear();
      const data = `${year}-${month}-${day}`;
      await fetchVisitTimesByTipoSala(data, medication.id_tiposala);
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

  const MedicationList = ({
    setOpen,
    setSelectedInfermiere,
  }: {
    setOpen: (open: boolean) => void;
    setSelectedInfermiere: (status: Infermiere | null) => void;
  }) => {
    return (
      <Command>
        <CommandInput placeholder="Filter infermiere..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {infermieri.map((infermiere) => (
              <CommandItem
                key={infermiere.id_infermiere}
                value={`${infermiere.utente.nome || ''} ${infermiere.utente.cognome || ''}`}
                onSelect={(value) => {
                  setSelectedInfermiere(
                    infermieri.find((m) => `${m.utente.nome} ${m.utente.cognome}` === value) || null
                  );
                  setOpen(false);
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

  const handleEliminaClick = () => {
    console.log('Elimina');
  };

  const onSubmit = async (values: z.infer<typeof medicazioneFormSchema>) => {
    const medicazioneFormSchema = {
      id_paziente: values.paziente.id_paziente,
      id_infermiere: values.infermiere.id_infermiere,
      datainizio: convertToISO8601(values.datainizio),
      esito: values.esito,
      note: values.note,
      id_tiposala: medication.id_tiposala
    };

    await updateMedicazione(medication.id_prelievimedicazioni, medicazioneFormSchema);

    fetchData()
  };

  return (
    <div>

    {prevmedChange && <Form {...form}>
      <div className="space-y-8 flex flex-col">
        <div>
          <FormField
            control={form.control}
            name="infermiere"
            render={({ field }) => (
              <FormItem className="flex flex-col my-2">
                <FormLabel>Infermiere</FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[150px] justify-start">
                        {selectedInfermiere ? `${selectedInfermiere.utente.nome || ''} ${selectedInfermiere.utente.cognome || ''}` : 'Seleziona un infermiere'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                      <MedicationList setOpen={setOpen} setSelectedInfermiere={(infermiere) => {
                        setSelectedInfermiere(infermiere);
                        field.onChange(infermiere);
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
            name="paziente.utente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paziente</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder="Paziente"
                    value={`${field.value?.nome} ${field.value?.cognome}`}
                  />
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
                <FormLabel>Data inizio medicazione/prelievo</FormLabel>
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
                    value={field.value}
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
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-5">
          <Dialog open={openDialog}>
            {/* <DialogTrigger asChild onClick={() => { setOpenDialog(true) }}>
              <Button className={`bg-[#334155]text-white hover:bg-[#4f5662]`} >Elimina</Button>
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Vuoi eliminare la medicazione o il prelievo?</DialogTitle>
                <DialogDescription>
                  Una volta cancellata non è possibile tornare indietro
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit" className="bg-slate-400 hover:bg-slate-700" onClick={() => { setOpenDialog(false) }}>Annulla</Button>
                <Button type="submit" onClick={() => { setOpenDialog(false); handleEliminaClick() }}>Conferma</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button type="submit" onClick={() => onSubmit(form.getValues())}>Salva</Button>
        </div>
      </div>
    </Form >}
    </div>
  )
};
