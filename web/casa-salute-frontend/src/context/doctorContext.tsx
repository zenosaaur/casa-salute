
import React, { ReactNode, createContext, useContext } from 'react';
import useDoctor, { UseDoctorHook } from '@/hooks/useDoctor'

interface DoctorProviderProps {
  children: ReactNode;
}

// Creazione del contesto per le medicazioni
const DoctorContext = createContext<UseDoctorHook | undefined>(undefined);

// Provider del contesto per le medicazioni
export const DoctorProvider: React.FC<DoctorProviderProps> = ({ children }) => {
  const doctorHook = useDoctor();

  return (
    <DoctorContext.Provider value={doctorHook}>
      {children}
    </DoctorContext.Provider>
  );
};

// Hook personalizzato per utilizzare il contesto delle medicazioni
export const useDoctorContext = (): UseDoctorHook => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error('useDoctorContext deve essere utilizzato all\'interno di un DoctorProvider');
  }
  return context;
};
