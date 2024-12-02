import React, { useEffect, useState } from "react";
import { Paziente, Utente } from "@/hooks/type";
import { Topbar } from "@/components/topbar";
import Home from "./Home";
import Visite from "./Visite";
import Prelievi from "./Prelievi";
import { Sidebar } from "@/components/sidebar";
import { PatientProvider } from "@/context/patientContetxt";
import { AddVisitFormPatient } from "@/components/form/add-visit-patient-form";
import { Mail, Hospital, Syringe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import useResponsabile from "@/hooks/useResponsabile";
import usePaziente from "@/hooks/usePatient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useVisit from "@/hooks/useVisit";
import { AddMedicazioneFormPatient } from "@/components/form/add-medicazione-patient";
import useMedication from "@/hooks/useMedication";

interface Props {
  utente: Utente;
}

const Dashboard: React.FC<Props> = ({ utente }) => {
  const { responsabile, fetchResponsabileByUtente } = useResponsabile();
  const { paziente, fetchPazienteByUtente } = usePaziente();
  const { addVisita } = useVisit();
  const {addMedicazione} = useMedication()
  const { user } = useAuth();
  const [currentPaziente, setPaziente] = useState<Paziente>();
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [addForm, setAddForm] = useState<boolean>(false);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user?.ruolo === "responsabile") {
        await fetchResponsabileByUtente(user.utente);
      } else {
        await fetchPazienteByUtente(utente.id_utente);
      }
    };

    fetchData();
  }, [user, utente.id_utente]);

  useEffect(() => {
    if (responsabile && user?.ruolo === "responsabile") {
      setPaziente(responsabile.paziente);
    } else if (paziente) {
      setPaziente(paziente);
    }
  }, [responsabile, paziente, user]);

  const sidebarOptions = [
    { label: "Home", icon: <Mail />, page: "home" },
    { label: "Visite", icon: <Hospital />, page: "visite" },
    { label: "Prelievi e medicazioni", icon: <Syringe />, page: "prelievi" },
  ];

  const handleChildData = (data: any) => {
    setData(data);
  };

  return (
    <div className="absolute top-0 left-0 w-full">
      <div className="grid grid-cols-[repeat(5,_1fr)] grid-rows-[repeat(5,_1fr)] gap-x-[0px] gap-y-[0px]">
        <div className="[grid-area:1_/_2_/_6_/_6] w-full min-h-screen p-10 border-2 border-sky-500">
          {currentPaziente && (
            <Topbar
              setAddForm={setAddForm}
              utente={utente}
              formComponent={
                currentPage !== "home" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className={`bg-[#334155]text-white w-full flex hover: bg-[#4f5662]`}
                      >
                        Aggiungi
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Prenota{" "}
                          {currentPage == "visite" ? "Visita" : "Prelievo"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Prenota{" "}
                          {currentPage == "visite"
                            ? "una visita"
                            : "un prelievo"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      {(currentPage == "visite" && (
                        <AddVisitFormPatient
                          currentPaziente={currentPaziente}
                          save={handleChildData}
                        />
                      )) ||
                        (currentPage == "prelievi" && (
                          <AddMedicazioneFormPatient
                            currentPaziente={currentPaziente}
                            save={handleChildData}
                          />
                        ))}
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        {(currentPage == "visite" && (
                          <AlertDialogAction
                            className="bg-[#0f172a] hover:bg-[#4f5662]"
                            onClick={() => addVisita(data)}
                          >
                            Salva
                          </AlertDialogAction>
                        )) ||
                          (currentPage == "prelievi" && (
                            <AlertDialogAction
                              className="bg-[#0f172a] hover:bg-[#4f5662]"
                              onClick={() => 
                                addMedicazione(data)}
                            >
                              Salva
                            </AlertDialogAction>
                          ))}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )
              }
            />
          )}

          {currentPage === "home" && currentPaziente && (
            <PatientProvider>
              {" "}
              <Home paziente={currentPaziente} />{" "}
            </PatientProvider>
          )}
          {currentPage === "visite" && (
            <PatientProvider>
              {" "}
              <Visite />{" "}
            </PatientProvider>
          )}
          {currentPage === "prelievi" && (
            <PatientProvider>
              {" "}
              <Prelievi />{" "}
            </PatientProvider>
          )}
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
