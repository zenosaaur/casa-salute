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
import { cn, formatDataEurope } from "@/lib/utils";
import { Paziente } from "@/hooks/type";
import {
  columns,
  Prenotazione,
} from "@/components/table/prenotazione-visite/columns";
import { DataTable } from "@/components/table/prenotazione-visite/data-table";
import useDoctor from "@/hooks/useDoctor";
import { useEffect, useState } from "react";
import useVisit from "@/hooks/useVisit";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import useAssenza from "@/hooks/useAssenza";
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
});

export const AddVisitFormPatient: React.FC<Props> = ({
  currentPaziente,
  save,
}) => {
  const formData = useForm<z.infer<typeof FormSelectData>>({
    resolver: zodResolver(FormSelectData),
    defaultValues: {
      dob: new Date(), // Setting default value
    },
  });

  const { fecthAvailableTimesOnDateAndMedico } = useVisit();
  const {
    medico,
    mediciSostituti,
    error: doctorError,
    fetchMedicoByPaziente,
    fetchMediciSostitutiByMedico,
  } = useDoctor();
  const { fetchAssenzaByMedicoAndDate, assenza } = useAssenza();
  const [prenotazione, setPrenotazione] = useState<Prenotazione[]>([]);
  const [urgenza, setUrgenza] = useState<boolean>(false);
  const [data, setData] = useState<Date>();

  const onSubmit = async (data: z.infer<typeof FormSelectData>) => {
    setData(data.dob);
  };

  useEffect(() => {
    if (data) {
      (async () => {
        await fetchMediciSostitutiByMedico(medico.id_medico);
      })();
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      (async () => {
        await fetchAssenzaByMedicoAndDate(medico.id_medico, data);
      })();
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      console.log("ez")
      let medico_temp;
      let id_medico;
      if (assenza) {
        medico_temp = mediciSostituti[0].medicoSostituto;
        id_medico = mediciSostituti[0].id_medicosostituto
        console.log("1: " + id_medico)
      } else {
        medico_temp = medico;
        id_medico = medico?.id_medico
        console.log("2: " + id_medico)
      }
      let available;
      (async () => {
        available = await fecthAvailableTimesOnDateAndMedico(
          id_medico,
          data
        );
        const temp: Prenotazione[] = available.times.map((time) => {
          const [hoursStr, minutesStr] = time.split(":");
          // Converting to numbers
          const hours: number = parseInt(hoursStr, 10);
          const minutes: number = parseInt(minutesStr, 10);
          data.setMinutes(minutes);
          data.setHours(hours+2);
          return {
            data: formatDataEurope(data.toISOString(),false,true) + " " + time,
            medico: medico_temp.utente.nome + " " + medico_temp.utente.cognome,
            ambulatorio: available.ambulatorio,
            id_tipoambulatorio: available.id_tipoambulatorio,
            id_medico: id_medico,
            urgenza: urgenza? "True" : "False",
            timestamp: data.toISOString(),
          };
        });
        console.log(temp)
        setPrenotazione(temp);
      })();
    }
  }, [mediciSostituti, data]);

  // gestione selezione della riga in dataRow
  const [dataFromChild, setDataFromChild] = useState<Prenotazione>();

  const handleChildData = (data: Prenotazione) => {
    setDataFromChild(data);
    // preparazione dei dati per essere salvati
    const visit = {
      id_paziente: currentPaziente.id_paziente,
      id_medico: data.id_medico,
      datainizio: data.timestamp,
      urgenza: urgenza,
      id_tipoambulatorio: data.id_tipoambulatorio,
    };
    save(visit);
  };
  useEffect(() => {
    if (currentPaziente) {
      fetchMedicoByPaziente(currentPaziente.id_paziente);
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
                          fromDate={new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="max-w-80">
                      Selezionare una data per vedere le prenotazioni di quel
                      giorno
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  className="p-2"
                  checked={urgenza}
                  onClick={() => setUrgenza(!urgenza)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Urgente
                </label>
              </div>
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
              Nome Medico
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
              {dataFromChild.medico}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Ambulatorio
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
              {dataFromChild.ambulatorio}
            </span>
          </div>
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
