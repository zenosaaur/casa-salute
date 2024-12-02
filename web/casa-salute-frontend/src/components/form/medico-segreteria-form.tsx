"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { date, z } from "zod";
import { cn, convertToISO8601 } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Medico, Visit } from "@/hooks/type";
import { medicoFormSchema, patientFormSchema } from "@/lib/form-schema";
import useDoctor from "@/hooks/useDoctor";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import usePaziente from "@/hooks/usePatient";

interface Props {
  onClose: () => void;
}

export const MedicoForm: React.FC<Props> = ({ onClose }) => {
  const { medici, fetchAllMediciBase, error, createMedicoAndSostituto } = useDoctor();
  const form = useForm<z.infer<typeof medicoFormSchema>>({
    resolver: zodResolver(medicoFormSchema),
  });

  const [open, setOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>();
  useEffect(() => {
    const fetchData = async () => {
      await fetchAllMediciBase();
    };
    fetchData();
  }, []);

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
            {medici.map((medico) => (
              <CommandItem
                key={medico.id_medico}
                value={`${medico.utente.nome || ""} ${medico.utente.cognome || ""
                  }`}
                onSelect={(value) => {
                  setSelectedMedico(
                    medici.find(
                      (m) => `${m.utente.nome} ${m.utente.cognome}` === value
                    ) || null
                  );
                  setOpen(false);
                }}
              >
                {`${medico.utente.nome || ""} ${medico.utente.cognome || ""}`}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  async function onSubmit(values: z.infer<typeof medicoFormSchema>) {
    const dateParts = values.data.split("/");
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const tmp = new Date(year, month, day);
    const medico = {
      nome: values.nome,
      cognome: values.cognome,
      email: values.email,
      password: values.password,
      codicefiscale: values.codicefiscale,
      data: convertToISO8601(tmp),
      luogonascita: values.luogonascita,
      specializzazione: values.specializzazione,
      id_medicosostituto: values.medico.id_medico
    }
    await createMedicoAndSostituto(medico)


    if (error == null) {
      onClose()
    }
  }

  return (
    <div className="max-h-[500px] overflow-auto p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="specializzazione"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specializzazione</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Specializzazione"
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome"
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cognome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cognome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Cognome"
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data di Nascita</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Data di nascita"
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="luogonascita"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Luogo di Nascita</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Luogo di nascita"
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codicefiscale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codice fiscale</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Codice fiscale"
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medico"
              render={({ field }) => (
                <FormItem className="flex flex-col my-2">
                  <FormLabel>Medico</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {selectedMedico
                            ? `${selectedMedico.utente.nome || ""} ${selectedMedico.utente.cognome || ""
                            }`
                            : "Seleziona un medico da sostituire"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <MedicoList
                          setOpen={setOpen}
                          setSelectedMedico={(medico) => {
                            setSelectedMedico(medico);
                            field.onChange(medico);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Salva</Button>
        </form>
      </Form>
    </div>
  );
};
