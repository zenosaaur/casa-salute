import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Medico } from "@/hooks/type";
import { cn, convertToISO8601, formatDataEurope } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import useAssenza from "@/hooks/useAssenza";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Card } from "./ui/card";

interface SheetMediciProps {
  children?: ReactNode;
  medico: Medico | undefined;
}

export function SheetMedici({ children, medico }: SheetMediciProps) {
  const { assenze, fetchAssenzaByMedico, addAssenza } = useAssenza();
  const [date, setDate] = useState<Date>();

  const fetchData = async () => {
    if (medico) await fetchAssenzaByMedico(medico?.id_medico);
  };

  useEffect(() => {
    fetchData();
  }, [medico?.id_medico]);

  const handlerSave = async () => {
    const assenzaFormData = {
      id_medico: medico?.id_medico,
      data: convertToISO8601(date),
    };

    await addAssenza(assenzaFormData);
    fetchData();
  };

  return (
    <Sheet>
      {medico != undefined && (
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Più dettagli</SheetTitle>
            <SheetDescription>
              Più informazioni riguardanti il medico
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome e Cognome
              </Label>
              <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                {medico.utente.nome} {medico.utente.cognome}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                {medico.utente.email}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codice-sanitario" className="text-right">
                Specializzazione
              </Label>
              <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                {medico.specializzazione}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codice-sanitario" className="text-right">
                Data di nascita
              </Label>
              <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                {formatDataEurope(medico.utente.data)}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codice-sanitario" className="text-right">
                Luogo di nascita
              </Label>
              <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                {medico.utente.luogonascita}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codice-fiscale" className="text-right">
                Codice fiscale
              </Label>
              <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                {medico.utente.codicefiscale}
              </span>
            </div>
          </div>
          <hr />
          <div className="flex justify-between items-center p-5">
            <Label className="text-right">Assenze</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"} className="bg-slate-200">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Aggiungi assenza medico</DialogTitle>
                  <DialogDescription>
                    Indica la giornata in cui il medico risulterà assente.
                  </DialogDescription>
                </DialogHeader>

                <div className="w-full space-y-8 flex flex-col bg-white p-4 shadow-md rounded-md">
                  <div className="flex flex-col">
                    <Label className="text-left mb-2">Data assenza</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[220px] justify-start text-left font-normal",
                            date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Scegli una data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          onSelect={(date) => {
                            if (date) setDate(date);
                          }}
                          fromDate={new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Chiudi
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="submit" onClick={handlerSave}>
                      Salva
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            {assenze.map((assenza) => (
              <Card
                key={assenza.id_assenza}
                className="flex justify-between items-center"
              >
                <span className="m-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                  {formatDataEurope(assenza.data, false)}
                </span>
                {/* <Button variant={"outline"}>
                  <TrashIcon className="h-4 w-4 text-red-600" />
                </Button> */}
              </Card>
            ))}
          </div>
          <hr className="mb-5" />
          <SheetFooter>
            <SheetClose asChild>
              <Button>Chiudi</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      )}
      {children}
    </Sheet>
  );
}
