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
import { Medico } from "@/hooks/type"
import { formatDataEurope } from "@/lib/utils"
import { ReactNode } from "react"

interface SheetMedicoProps {
  children?: ReactNode;
  medico: Medico | undefined
}

export function SheetDottore({ children, medico }: SheetMedicoProps) {
  return (
    <Sheet>
      {medico != undefined && <SheetContent>
        <SheetHeader>
          <SheetTitle>Piu dettagli</SheetTitle>
          <SheetDescription>
            Piu informazioni riguardanti la tua visita
          </SheetDescription>
        </SheetHeader>
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
