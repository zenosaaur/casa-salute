
import React, { ReactNode, createContext, useContext } from 'react';
import useMedication, { UseMedicationHook } from '@/hooks/useMedication'
import usePatient, { UsePatientHook } from '@/hooks/usePatient';

interface PatientProviderProps {
  children: ReactNode;
}

// Creazione del contesto per le medicazioni
const PatientContext = createContext<UsePatientHook | undefined>(undefined);

// Provider del contesto per le medicazioni
export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const patientHook = usePatient();

  return (
    <PatientContext.Provider value={patientHook}>
      {children}
    </PatientContext.Provider>
  );
};

// Hook personalizzato per utilizzare il contesto delle medicazioni
export const usePatientContext = (): UsePatientHook => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatientContext deve essere utilizzato all\'interno di un PatientProvider');
  }
  return context;
};
