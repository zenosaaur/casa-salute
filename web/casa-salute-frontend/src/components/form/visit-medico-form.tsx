import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
} from "@/components/ui/form"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Visit } from "@/hooks/type"
import { visitFormSchema } from "@/lib/form-schema"
import useVisit from "@/hooks/useVisit"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

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
  const { updateVisita } = useVisit();
  const { availableTimesInAmbulatorio, fetchVisitTimesByAmbulatorio } = useVisit()
  const [timeDate, setTimeDate] = useState<Date>()
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof visitFormSchema>>({
    resolver: zodResolver(visitFormSchema)
  });

  useEffect(() => {
    form.reset({
      medico: visit.medico,
      paziente: visit.paziente || '',
      datainizio: visit.datainizio ? new Date(visit.datainizio) : new Date(),
      regime: visit.regime || '',
      esito: visit.esito || '',
      urgenza: visit.urgenza || '',
      ambulatorio: visit.ambulatorio
    });

    setTimeDate(form.getValues().datainizio)
    fetchAvailableTimes()

  }, [visit])

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div>
          <FormField
            control={form.control}
            name="medico.utente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medico</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder="Medico"
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
                        setTimeDate(date)
                        fetchAvailableTimes()
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
            name="urgenza"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgenza</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Urgenza"
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
