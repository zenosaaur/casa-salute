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
import { Medico, MedicoSostituto, Paziente, Visit } from "@/hooks/type"
import { ComboboxDemo } from "@/components/combobox"
import { assenzaFormSchema } from "@/lib/form-schema"
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

interface Props {
  setAddForm: React.Dispatch<React.SetStateAction<boolean>>,
  currentMedico: Medico
}

export const AddAssenzaForm: React.FC<Props> = ({ setAddForm, currentMedico }) => {
  const { medici, mediciSostituti, error, fetchMediciSostitutiByMedico, fetchAllMedici } = useDoctor();
  const { assenze, fetchAssenzaByMedico, addAssenza } = useAssenza()

  const form = useForm<z.infer<typeof assenzaFormSchema>>({
    resolver: zodResolver(assenzaFormSchema),
    defaultValues: {
      medico: currentMedico ? currentMedico : undefined,
      data: undefined
    },
  });

  const [openMedico, setOpenMedico] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(currentMedico ? currentMedico : null);

  const close = () => {
    form.reset();
    setAddForm(false)
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!currentMedico)
        await fetchAllMedici();
    };

    fetchData();
  }, []);

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
              <CommandItem
                key={currentMedico.id_medico}
                value={`${currentMedico.utente.nome || ''} ${currentMedico.utente.cognome || ''}`}
                onSelect={(value) => {
                  setSelectedMedico(
                    currentMedico
                  );
                  setOpenMedico(false);
                }}
              >
                {`${currentMedico.utente.nome || ''} ${currentMedico.utente.cognome || ''}`}
              </CommandItem>
              :
              medici.map((medico) => (
                <CommandItem
                  key={medico.id_medico}
                  value={`${medico.utente.nome || ''} ${medico.utente.cognome || ''}`}
                  onSelect={(value) => {
                    setSelectedMedico(
                      medici.find((m) => `${m.utente.nome} ${m.utente.cognome}` === value) || null
                    );
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

  const onSubmit = async (values: z.infer<typeof assenzaFormSchema>) => {
    const assenzaFormData = {
      id_medico: currentMedico ? currentMedico.id_medico : values.medico.id_medico,
      data: convertToISO8601(values.data)
    };

    await addAssenza(assenzaFormData);
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


