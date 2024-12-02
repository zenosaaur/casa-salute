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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { Infermiere, Medico, MedicoSostituto, Paziente, TipoSala, Visit } from "@/hooks/type"
import { ComboboxDemo } from "@/components/combobox"
import { assenzaFormSchema, servizioSalaFormSchema } from "@/lib/form-schema"
import useDoctor from "@/hooks/useDoctor"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"

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
import useAssenza from "@/hooks/useAssenza"
import useInfermiere from "@/hooks/useInfermiere"
import useServizioSala from "@/hooks/useServizioSala"
import useTipoSala from "@/hooks/useTipoSala"

interface Props {
  setAddForm: React.Dispatch<React.SetStateAction<boolean>>,
  currentInfermiere: Infermiere
}

export const AddServizioSalaForm: React.FC<Props> = ({ setAddForm, currentInfermiere }) => {
  const { infermieri, fetchInfermieri } = useInfermiere();
  const { servizisala, fetchServizioSalaByInfermiere, addServizioSala } = useServizioSala()
  const { tipisala, fetchAllTipiSala } = useTipoSala();

  const form = useForm<z.infer<typeof servizioSalaFormSchema>>({
    resolver: zodResolver(servizioSalaFormSchema),
    defaultValues: {
      infermiere: currentInfermiere ? currentInfermiere : undefined,
      data: undefined,
      sala: undefined
    },
  });

  const [openInfermiere, setOpenInfermiere] = useState(false);
  const [selectedInfermiere, setSelectedInfermiere] = useState<Infermiere | null>(currentInfermiere ? currentInfermiere : null);

  const [openTipoSala, setOpenTipoSala] = useState(false);
  const [selectedTipoSala, setSelectedTipoSala] = useState<TipoSala | null>()

  const close = () => {
    form.reset();
    setAddForm(false)
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!currentInfermiere) {
        await fetchInfermieri();
      }
      await fetchAllTipiSala();
    };

    fetchData();
  }, []);

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
            {currentInfermiere ?
              <CommandItem
                key={currentInfermiere.id_infermiere}
                value={`${currentInfermiere.utente.nome || ''} ${currentInfermiere.utente.cognome || ''}`}
                onSelect={(value) => {
                  setSelectedInfermiere(
                    currentInfermiere
                  );
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
                    setSelectedInfermiere(
                      infermieri.find((m) => `${m.utente.nome} ${m.utente.cognome}` === value) || null
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

  const TipiSalaList = ({
    setOpenTipoSala,
    setSelectedTipoSala,
  }: {
    setOpenTipoSala: (open: boolean) => void;
    setSelectedTipoSala: (status: TipoSala | null) => void;
  }) => {
    return (
      <Command>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {
              tipisala.map((tiposala) => (
                <CommandItem
                  key={tiposala.id_tiposala}
                  value={`${tiposala.tipo || ''}`}
                  onSelect={(value) => {
                    setSelectedTipoSala(
                      tipisala.find((m) => `${m.tipo}` === value) || null
                    );
                    setOpenTipoSala(false);
                  }}
                >
                  {`${tiposala.tipo || ''}`}
                </CommandItem>
              ))
            }
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  const onSubmit = async (values: z.infer<typeof servizioSalaFormSchema>) => {
    const servizioSalaFormData = {
      id_infermiere: currentInfermiere ? currentInfermiere.id_infermiere : values.infermiere.id_infermiere,
      data: convertToISO8601(values.data),
      sala: values.sala.id_tiposala
    };

    await addServizioSala(servizioSalaFormData);
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
              render={({ field }) => (
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
              )}
            />

            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data assenza</FormLabel>
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
                            format(field.value, "PPP")
                          ) : (
                            <span>Scegli una data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <FormDescription>Data assenza</FormDescription>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        onSelect={(date) => {
                          field.onChange(date);
                        }}
                        fromDate={new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sala"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo di sala</FormLabel>
                  <FormControl>
                    <Popover open={openTipoSala} onOpenChange={setOpenTipoSala}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[150px] justify-start">
                          {selectedTipoSala ? `${selectedTipoSala.tipo || ''}` : 'Seleziona sala'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <TipiSalaList setOpenTipoSala={setOpenTipoSala} setSelectedTipoSala={(tiposala) => {
                          setSelectedTipoSala(tiposala);
                          field.onChange(tiposala);
                        }} />
                      </PopoverContent>
                    </Popover>
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


