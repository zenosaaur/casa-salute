"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { convertToISO8601 } from "@/lib/utils";
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
import { patientRespFormSchema } from "@/lib/form-schema";
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
import useTipoAmbulatorio from "@/hooks/useTipoAmbulatorio";

interface Props {
  onClose: () => void;
}

export const PatientRespForm: React.FC<Props> = ({ onClose }) => {
  const { medici, fetchAllMedici } = useDoctor();
  const { tipiAmbulatorio, fetchAllTipiAmbulatori } = useTipoAmbulatorio()
  const { createPaziente, error } = usePaziente();
  const form = useForm<z.infer<typeof patientRespFormSchema>>({
    resolver: zodResolver(patientRespFormSchema),
  });

  const [open, setOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>();
  useEffect(() => {
    const fetchData = async () => {
      await fetchAllTipiAmbulatori();
      await fetchAllMedici();
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
    // Filter tipiambulatorio to include only those with tipo = 'Pediatrico'
    const pediatricoMedicoIds = tipiAmbulatorio
      .filter(t => t.tipo === 'Pediatrico')
      .map(t => t.id_medico);
  
    // Filter medici based on the extracted id_medico values
    const filteredMedici = medici.filter(medico =>
      pediatricoMedicoIds.includes(medico.id_medico)
    );
  
    return (
      <Command>
        <CommandInput placeholder="Filter medico..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {filteredMedici.map((medico) => (
              <CommandItem
                key={medico.id_medico}
                value={`${medico.utente.nome || ""} ${medico.utente.cognome || ""}`}
                onSelect={(value) => {
                  setSelectedMedico(
                    filteredMedici.find(
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

  async function onSubmit(values: z.infer<typeof patientRespFormSchema>) {
    let dateParts = values.data.split("/");
    let day = parseInt(dateParts[0], 10);
    let month = parseInt(dateParts[1], 10) - 1;
    let year = parseInt(dateParts[2], 10);
    const tmp = new Date(year, month, day);
    dateParts = values.data_resp.split("/");
    day = parseInt(dateParts[0], 10);
    month = parseInt(dateParts[1], 10) - 1;
    year = parseInt(dateParts[2], 10);
    const tmp_resp = new Date(year, month, day);
    const paziente = {
      id_medico: values.medico.id_medico,
      codicesanitario: values.codicesanitario,
      nome: values.nome,
      cognome: values.cognome,
      email: values.email,
      password: values.password,
      codicefiscale: values.codicefiscale,
      data: convertToISO8601(tmp),
      luogonascita: values.luogonascita,
      nome_resp: values.nome_resp,
      cognome_resp: values.cognome_resp,
      codicefiscale_resp: values.codicefiscale_resp,
      luogonascita_resp: values.luogonascita_resp,
      data_resp: convertToISO8601(tmp_resp),
    };
    await createPaziente(paziente);
    if (error == null) {
      // chiudere il form
      onClose();
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
              name="medico"
              render={({ field }) => (
                <FormItem className="flex flex-col my-2">
                  <FormLabel>Medico</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[160px] justify-start"
                        >
                          {selectedMedico
                            ? `${selectedMedico.utente.nome || ""} ${selectedMedico.utente.cognome || ""
                            }`
                            : "Seleziona un medico"}
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

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome - Assistito</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" defaultValue={""} {...field} />
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
                  <FormLabel>Cognome - Assistito</FormLabel>
                  <FormControl>
                    <Input placeholder="Cognome" defaultValue={""} {...field} />
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
                  <FormLabel>Data di Nascita - Assistito</FormLabel>
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
                  <FormLabel>Luogo di Nascita - Assistito</FormLabel>
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
                  <FormLabel>Codice fiscale - Assistito</FormLabel>
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
              name="codicesanitario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codice sanitario - Assistito</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Codice sanitario"
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
                  <FormLabel>Email - Responsabile</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" defaultValue={""} {...field} />
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
                  <FormLabel>Password - Responsabile</FormLabel>
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
              name="nome_resp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome - Responsabile</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" defaultValue={""} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cognome_resp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cognome - Responsabile</FormLabel>
                  <FormControl>
                    <Input placeholder="Cognome" defaultValue={""} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data_resp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data di Nascita - Responsabile</FormLabel>
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
              name="luogonascita_resp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Luogo di Nascita - Responsabile</FormLabel>
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
              name="codicefiscale_resp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codice fiscale - Responsabile</FormLabel>
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
          </div>
          <Button type="submit">Salva</Button>
        </form>
      </Form>
    </div>
  );
};
