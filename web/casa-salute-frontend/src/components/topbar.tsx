import React from "react";
import { Avatar, } from "./ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Utente } from "@/hooks/type";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";


interface Props {
  utente: Utente | undefined,
  formComponent?: React.ReactNode
  setAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  viewAdd: boolean;
}

export const Topbar: React.FC<Props> = ({ utente, formComponent, setAddForm, viewAdd }) => {
  const logo: string = `${utente?.nome?.[0] ?? ''}${utente?.cognome?.[0] ?? ''}`;
  const { logout, } = useAuth();


  const AvatarComponent = () => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Avatar className="bg-[#0f172a] text-white items-center justify-center font-bold hover:cursor-pointer">
            {logo}
          </Avatar>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Impostazioni</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Chiudi</AlertDialogCancel>
            <AlertDialogAction className="bg-[#0f172a] hover:bg-[#4f5662]" onClick={() => { logout() }}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <div className="flex justify-between mb-8">
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Bentornato {utente?.nome}
        </h3>
      </div>
      <div className="flex flex-row gap-7 items-center">
        {viewAdd && 
        <Button className={`bg-[#334155]text-white w-full flex hover: bg-[#4f5662]`} onClick={() => { setAddForm(true) }}>
          Aggiungi
        </Button>}
        <AvatarComponent />
        {formComponent}
      </div>
    </div>
  )
};
