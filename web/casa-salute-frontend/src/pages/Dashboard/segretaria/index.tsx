import { Sidebar } from "@/components/sidebar";
import React, { useState } from "react";

import Home from "@/pages/Dashboard/segretaria/Home";
import Pazienti from "@/pages/Dashboard/segretaria/Pazienti";
import Medici from "@/pages/Dashboard/segretaria/Medici";
import Infermieri from "@/pages/Dashboard/segretaria/Infermieri";
import { Utente } from "@/hooks/type";
import { Topbar } from "@/components/topbar";
import { MedicationProvider } from "@/context/medicationContext";
import { VisitProvider } from "@/context/visitContext";

import { PersonStanding, Apple, Mail, GitMerge } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { PatientForm } from "@/components/form/patient-segreteria-form";
import { PatientRespForm } from "@/components/form/patient-resp-segretaria-form";
import { InfermiereForm } from "@/components/form/infermiere-segreteria-form";
import { Checkbox } from "@/components/ui/checkbox";
import { MedicoForm } from "@/components/form/medico-segreteria-form";

interface Props {
  utente: Utente;
}

const Dashboard: React.FC<Props> = ({ utente }) => {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [addForm, setAddForm] = useState<boolean>(false);
  const [responsabile, setResp] = useState<boolean>();
  const [openForm, setOpen] = useState(false);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const sidebarOptions = [
    { label: "Home", icon: <Mail />, page: "home" },
    { label: "Pazienti", icon: <PersonStanding />, page: "pazienti" },
    { label: "Medici", icon: <Apple />, page: "medici" },
    { label: "Infermieri", icon: <GitMerge />, page: "infermieri" },
  ];

  return (
    <div className="absolute top-0 left-0 w-full">
      <div className="grid grid-cols-[repeat(5,_1fr)] grid-rows-[repeat(5,_1fr)] gap-x-[0px] gap-y-[0px]">
        <div className="[grid-area:1_/_2_/_6_/_6] w-full min-h-screen p-10 max-h-screen">
          <Topbar
            viewAdd={false}
            setAddForm={setAddForm}
            utente={utente}
            formComponent={
              currentPage !== "home" && (
                <AlertDialog open={openForm}>
                  <AlertDialogTrigger asChild>
                    <Button
                      className={`bg-[#334155]text-white w-full flex hover: bg-[#4f5662]`}
                      onClick={() => setOpen(true)}
                    >
                      Aggiungi
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Aggiungi{" "}
                        {currentPage == "pazienti" ? "un Paziente" : ""}
                        {currentPage == "medici" ? "un Medico" : ""}
                        {currentPage == "infermieri" ? "un Infermiere" : ""}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Aggiungi{" "}
                        {currentPage == "pazienti"
                          ? "un paziente compilando il form"
                          : ""}
                        {currentPage == "medici"
                          ? "un medico compilando il form"
                          : ""}
                        {currentPage == "infermieri"
                          ? "un infermiere compilando il form"
                          : ""}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex items-center space-x-2">
                      {currentPage == "pazienti" && (
                        <div className="flex items-center">
                          <Checkbox
                            id="responsabile"
                            className="p-2"
                            checked={responsabile}
                            onCheckedChange={() => setResp(!responsabile)}
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 p-2"
                          >
                            Minore di 14 anni
                          </label>
                        </div>
                      )}
                    </div>
                    {(currentPage == "pazienti" && !responsabile && (
                      <PatientForm onClose={() => setOpen(false)} />
                    )) ||
                      (currentPage == "pazienti" && responsabile && (
                        <PatientRespForm onClose={() => setOpen(false)} />
                      )) ||
                      (currentPage == "infermieri" && (
                        <InfermiereForm onClose={() => setOpen(false)} />
                      )) ||
                      (currentPage == "medici" && (
                        <MedicoForm onClose={() => setOpen(false)} />
                      ))}
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => {
                          setOpen(!openForm);
                        }}
                      >
                        Annulla
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )
            }
          />
          {currentPage === "home" && (
            <MedicationProvider>
              {" "}
              <VisitProvider>
                <Home />
              </VisitProvider>
            </MedicationProvider>
          )}
          {currentPage === "pazienti" && <Pazienti />}
          {currentPage === "medici" && <Medici />}
          {currentPage === "infermieri" && <Infermieri />}
        </div>
        <div className="[grid-area:1_/_1_/_6_/_2]  w-full min-h-screen">
          <Sidebar
            setPage={handlePageChange}
            currentPage={currentPage}
            options={sidebarOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
