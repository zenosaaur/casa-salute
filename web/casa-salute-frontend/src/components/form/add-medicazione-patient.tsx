"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { cn, convertToISO8601, formatDataEurope } from "@/lib/utils";
import { Paziente } from "@/hooks/type";
import {
  columns,
  Prenotazione,
} from "@/components/table/prenotazioni-medicazioni/columns";
import { DataTable } from "@/components/table/prenotazioni-medicazioni/data-table";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import useTipoSala from "@/hooks/useTipoSala";
interface Props {
  currentPaziente: Paziente;
  save: (data: any) => void;
}

const FormSelectData = z.object({
  dob: z
    .date({
      required_error: "Necessario inserire una data.",
    })
    .default(new Date()),
  tipo: z
    .string({
      required_error: "Seleziona tipolia di visita",
    }),
});

export const AddMedicazioneFormPatient: React.FC<Props> = ({
  currentPaziente,
  save,
}) => {
  const formData = useForm<z.infer<typeof FormSelectData>>({
    resolver: zodResolver(FormSelectData),
    defaultValues: {
      dob: new Date(), // Setting default value
    },
  });

  const { fetchAllTipiSala, tipisala, fetchVisitTimesByTipoSala, availableTimesInTipoSala } = useTipoSala()
  const [prenotazione, setPrenotazione] = useState<Prenotazione[]>([]);

  const onSubmit = async (data: z.infer<typeof FormSelectData>) => {
    await fetchVisitTimesByTipoSala(data.dob.toISOString(), data.tipo)
    const temp: Prenotazione[] = availableTimesInTipoSala.map((time) => {
      const [hoursStr, minutesStr] = time.split(":");
      // Converting to numbers
      const hours: number = parseInt(hoursStr, 10);
      const minutes: number = parseInt(minutesStr, 10);
      data.dob.setMinutes(minutes);
      data.dob.setHours(hours + 2);
      return {
        data: formatDataEurope(data.dob.toISOString(),false,true) + " " + time,
        timestamp: data.dob.toISOString(),
        tiposala: data.tipo
      };
    });
    setPrenotazione(temp)
  };
  // gestione selezione della riga in dataRow
  const [dataFromChild, setDataFromChild] = useState<Prenotazione>();

  const handleChildData = (data: Prenotazione) => {
    setDataFromChild(data);
    // preparazione dei dati per essere salvati

    const medicazione = {
      id_paziente: currentPaziente.id_paziente,
      datainizio: data.timestamp,
      id_infermiere: "",
      id_tiposala: data.tiposala,
    };
    save(medicazione);
  };
  useEffect(() => {
    if (currentPaziente) {
      fetchAllTipiSala()
    }
  }, [currentPaziente]);

  return (
    <div>
      {!dataFromChild && (
        <div>
          <Form {...formData}>
            <form
              onSubmit={formData.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={formData.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Seleziona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipologia</SelectLabel>
                          {tipisala.map((tipo) => (
                            <SelectItem
                              value={tipo.id_tiposala}
                              key={tipo.id_tiposala}
                            >
                              {tipo.tipo}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={formData.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Calendario</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Seleziona una data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          fromDate={new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="max-w-80">
                      Selezionare una data per vedere gli orari disponibili
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Cerca</Button>
            </form>
          </Form>
          <DataTable
            columns={columns}
            data={prenotazione}
            onData={handleChildData}
          />
        </div>
      )}
      {dataFromChild && (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Data
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
              {dataFromChild.data}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
