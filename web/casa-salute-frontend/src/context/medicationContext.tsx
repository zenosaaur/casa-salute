
import React, { ReactNode, createContext, useContext } from 'react';
import useMedication, { UseMedicationHook } from '@/hooks/useMedication'

interface MedicationProviderProps {
  children: ReactNode;
}

// Creazione del contesto per le medicazioni
const MedicationContext = createContext<UseMedicationHook | undefined>(undefined);

// Provider del contesto per le medicazioni
export const MedicationProvider: React.FC<MedicationProviderProps> = ({ children }) => {
  const medicationHook = useMedication();

  return (
    <MedicationContext.Provider value={medicationHook}>
      {children}
    </MedicationContext.Provider>
  );
};

// Hook personalizzato per utilizzare il contesto delle medicazioni
export const useMedicationContext = (): UseMedicationHook => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedicationContext deve essere utilizzato all\'interno di un MedicationProvider');
  }
  return context;
};
