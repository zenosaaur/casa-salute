"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { convertToISO8601 } from "@/lib/utils";
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
import { infermiereFormSchema } from "@/lib/form-schema";

import useInfermiere from "@/hooks/useInfermiere";

interface Props {
  onClose: () => void;
}

export const InfermiereForm: React.FC<Props> = ( {onClose} ) => {
  const {createInfermiere,error} = useInfermiere();
  const form = useForm<z.infer<typeof infermiereFormSchema>>({
    resolver: zodResolver(infermiereFormSchema),
  });


  async function onSubmit(values: z.infer<typeof infermiereFormSchema>) {
    const dateParts = values.data.split("/");
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const tmp = new Date(year, month, day);
    const infermiere = {
        nome: values.nome,
        cognome: values.cognome,
        email: values.email,
        password: values.password,
        codicefiscale: values.codicefiscale,
        data: convertToISO8601(tmp),
        luogonascita: values.luogonascita
    }
    await createInfermiere(infermiere)
    if(error==null){
        // chiudere il form 
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
          </div>
          <Button type="submit">Salva</Button>
        </form>
      </Form>
    </div>
  );
};
