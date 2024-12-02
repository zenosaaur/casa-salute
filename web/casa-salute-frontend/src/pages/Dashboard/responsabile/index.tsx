import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useResponsabile from "@/hooks/useResponsabile";
import { useAuth } from "@/hooks/useAuth";
import {
  Form,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  paziente: z
    .string({
      required_error: "Seleziona un paziente",
    }),
});

const ResponsabilePage: React.FC = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { responsabile, fetchResponsabileByUtente, loading } = useResponsabile();
  const { user , login } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      if (user) await fetchResponsabileByUtente(user.utente);
    };
    fetchData();
  }, []);

  const login_resp = (data: z.infer<typeof FormSchema>) => {
    let tmp = user
    tmp.utente = data.paziente
    tmp.ruolo = "paziente"
    tmp.responsabile = user?.utente
    login(tmp);
    navigate("/login", { replace: true });
  };

  return (
    <AlertDialog defaultOpen >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Seleziona paziente</AlertDialogTitle>
          <AlertDialogDescription>
            Selezionare un paziente
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center">
          {!loading && responsabile && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(login_resp)} className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="paziente"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder="Seleziona un Paziente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Pazienti</SelectLabel>
                            {responsabile.map((resp) => (
                              <SelectItem
                                value={resp.paziente.utente.id_utente}
                                key={resp.id_paziente}
                              >
                                {resp.paziente.utente.nome}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button type="submit">Login</Button>
              </form>
            </Form>
          )}
        </div>
        <AlertDialogFooter>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResponsabilePage;
