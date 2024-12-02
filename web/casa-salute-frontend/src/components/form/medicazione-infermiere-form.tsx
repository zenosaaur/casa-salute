"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn, convertToISO8601, formatData, formatDataUSA } from "@/lib/utils"
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
import { Medico, MedicoSostituto, PrelievoMedicazione, Visit } from "@/hooks/type"
import { medicazioneFormSchema, visitFormSchema } from "@/lib/form-schema"
import useDoctor from "@/hooks/useDoctor"


import useVisit from "@/hooks/useVisit"
import useInfermiere from "@/hooks/useInfermiere"
import useMedication from "@/hooks/useMedication"
import useTipoSala from "@/hooks/useTipoSala"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface Props {
  medicazione: PrelievoMedicazione;
  fetchData: () => void;
}

interface TimePickerProps {
  setDate: (date: Date | undefined) => void;
}

export const MedicazioneForm: React.FC<Props> = ({ medicazione, fetchData }) => {
  const { updateMedicazione } = useMedication();
  const [timeDate, setTimeDate] = useState<Date>()
  const { availableTimesInTipoSala, fetchVisitTimesByTipoSala } = useTipoSala()

  const form = useForm<z.infer<typeof medicazioneFormSchema>>({
    resolver: zodResolver(medicazioneFormSchema)
  });

  useEffect(() => {
    fetchAvailableTimes()
  }, [timeDate])

  useEffect(() => {
    form.reset({
      infermiere: medicazione.infermiere,
      paziente: medicazione.paziente || '',
      datainizio: medicazione.datainizio ? new Date(medicazione.datainizio) : new Date(),
      esito: medicazione.esito || '',
      note: medicazione.note || '',
      premed: medicazione.id_tiposala
    });


    setTimeDate(form.getValues().datainizio)

  }, [medicazione])

  const fetchAvailableTimes = async () => {
    if (timeDate && medicazione.id_tiposala) {
      const day = String(timeDate.getUTCDate()).padStart(2, '0');
      const month = String(timeDate.getUTCMonth() + 1).padStart(2, '0'); 
      const year = timeDate.getUTCFullYear();
      const data = `${year}-${month}-${day}`;
      await fetchVisitTimesByTipoSala(data, medicazione.id_tiposala);
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
    console.log("Medic")
    const medicazioneFormSchema = {
      id_paziente: values.paziente.id_paziente,
      id_infermiere: values.infermiere.id_infermiere,
      datainizio: convertToISO8601(values.datainizio),
      esito: values.esito,
      note: values.note,
      id_tiposala: medicazione.id_tiposala
    };

    await updateMedicazione(medicazione.id_prelievimedicazioni, medicazioneFormSchema);

    fetchData()
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div>
          <FormField
            control={form.control}
            name="infermiere.utente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Infermiere</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder="Infermiere"
                    value={`${field.value?.nome} ${field.value?.cognome}`}
                  />
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
        <Button type="submit">Salva</Button>
      </form>
    </Form>
  );
}


