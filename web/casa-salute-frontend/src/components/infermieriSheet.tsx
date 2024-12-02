import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Infermiere } from "@/hooks/type";
import { Calendar as CalendarIcon } from "lucide-react";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { ReactNode, useState, useEffect } from "react";
import { Label } from "./ui/label";
import { cn, convertToISO8601, formatDataEurope } from "@/lib/utils";
import useTipoSala from "@/hooks/useTipoSala";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import useServizioSala from "@/hooks/useServizioSala";
import { Card } from "./ui/card";

interface SheetInfermieriProps {
  children?: ReactNode;
  infermiere: Infermiere | undefined;
}

export function SheetInfermieri({
  children,
  infermiere,
}: SheetInfermieriProps) {
  const { fetchAllTipiSala, tipisala } = useTipoSala();
  const { addServizioSala, fetchServizioSalaByInfermiere, servizisala } =
    useServizioSala();
  const [date, setDate] = useState<Date>();

  const fetchData = async () => {
    if (infermiere)
      await fetchServizioSalaByInfermiere(infermiere?.id_infermiere);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllTipiSala();
      if (infermiere) {
        await fetchServizioSalaByInfermiere(infermiere?.id_infermiere);
      }
    };

    fetchData();
  }, [infermiere]);

  const handlerSave = async (tipoSala: any) => {
    const assenzaFormData = {
      id_infermiere: infermiere?.id_infermiere,
      data: convertToISO8601(date),
      sala: tipoSala,
    };

    await addServizioSala(assenzaFormData);
    fetchData();
  };

  return (
    <Sheet>
      {infermiere && (
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Piu dettagli</SheetTitle>
            <SheetDescription>
              Piu informazioni riguardante al paziente
            </SheetDescription>
          </SheetHeader>
          <div className="max-h-s mb-2">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome e Cognome
                </Label>
                <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                  {infermiere.utente.nome} {infermiere.utente.cognome}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                  {infermiere.utente.email}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="codice-sanitario" className="text-right">
                  Data di nascita
                </Label>
                <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                  {formatDataEurope(infermiere.utente.data)}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="codice-sanitario" className="text-right">
                  Luogo di nascita
                </Label>
                <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                  {infermiere.utente.luogonascita}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="codice-fiscale" className="text-right">
                  Codice fiscale
                </Label>
                <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                  {infermiere.utente.codicefiscale}
                </span>
              </div>
            </div>
            {tipisala.map((value) => (
              <div key={value.id_tiposala}>
                <div className="flex justify-between items-center p-5">
                  <Label className="text-right">{value.tipo}</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"outline"} className="bg-slate-200">
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Aggiungi presenza</DialogTitle>
                        <DialogDescription>
                          Indica la giornata in cui l'infermiere opera nella sala {value.tipo}.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="w-full space-y-8 flex flex-col bg-white p-4 shadow-md rounded-md">
                        <div className="flex flex-col">
                          <Label className="text-left mb-2">{value.tipo}</Label>
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
                          <Button
                            type="submit"
                            onClick={() => handlerSave(value.id_tiposala)}
                          >
                            Salva
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {servizisala && (
                  <div className="max-h-[60px] overflow-auto">
                    {servizisala
                      .filter(
                        (serviziosala) =>
                          serviziosala.sala.id_tiposala === value.id_tiposala
                      )
                      .map((serviziosala) => (
                        <Card
                          key={serviziosala.id_serviziosala}
                          className="flex justify-between items-center"
                        >
                          <span className="m-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                            {formatDataEurope(serviziosala.data, false)}
                          </span>
                          {/* <Button variant={"outline"}>
                            <TrashIcon className="h-4 w-4 text-red-600" />
                          </Button> */}
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="secondary">Chiudi</Button>
            </SheetClose>
            {/* <Button>Elimina</Button> */}
          </SheetFooter>
        </SheetContent>
      )}
      {children}
    </Sheet>
  );
}
