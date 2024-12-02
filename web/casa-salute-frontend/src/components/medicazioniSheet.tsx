import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Medication } from "@/hooks/type"
import { formatDataEurope } from "@/lib/utils"
import { ReactNode } from "react"

interface SheetMedicazioniProps {
  children?: ReactNode;
  medicazioni: Medication | undefined
}

export function SheetMedicazioni({ children, medicazioni }: SheetMedicazioniProps) {
  return (
    <Sheet>
      {medicazioni != undefined && <SheetContent>
        <SheetHeader>
          <SheetTitle>Piu dettagli</SheetTitle>
          <SheetDescription>
            Piu informazioni riguardanti la tua medicazione
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome Infermiere
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">{medicazioni.infermiere.utente.nome} {medicazioni.infermiere.utente.cognome}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Data
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">{medicazioni.datainizio}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Esito
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">{medicazioni.esito}</span>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Chiudi</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>}
      {children}
    </Sheet>
  )
}
