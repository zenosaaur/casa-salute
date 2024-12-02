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
import { Paziente } from "@/hooks/type"
import { formatDataEurope } from "@/lib/utils"
import { ReactNode } from "react"

interface SheetMedicoProps {
  children?: ReactNode;
  paziente: Paziente | undefined
}



export function SheetPazienti({ children, paziente }: SheetMedicoProps) {
  return (
    <Sheet>
      {paziente != undefined && <SheetContent>
        <SheetHeader>
          <SheetTitle>Piu dettagli</SheetTitle>
          <SheetDescription>
            Piu informazioni riguardante al paziente
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome e Cognome
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">{paziente.utente.nome} {paziente.utente.cognome}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">{paziente.utente.email}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codice-sanitario" className="text-right">
              Codice sanotario
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">{paziente.codicesanitario}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codice-sanitario" className="text-right">
              Data di nascita
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">{formatDataEurope(paziente.utente.data)}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codice-sanitario" className="text-right">
              Luogo di nascita
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">{paziente.utente.luogonascita}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codice-fiscale" className="text-right">
              Codice fiscale
            </Label>
            <span className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">{paziente.utente.codicefiscale}</span>
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
