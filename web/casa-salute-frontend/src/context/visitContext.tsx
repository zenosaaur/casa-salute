

import useVisit, { UseVisitHook } from '@/hooks/useVisit';
import React, { ReactNode, createContext, useContext } from 'react';

interface VisitProviderProps {
  children: ReactNode;
}

// Creazione del contesto per le medicazioni
const VisitContext = createContext<UseVisitHook | undefined>(undefined);

// Provider del contesto per le medicazioni
export const VisitProvider: React.FC<VisitProviderProps> = ({ children }) => {
  const visitHook = useVisit();

  return (
    <VisitContext.Provider value={visitHook}>
      {children}
    </VisitContext.Provider>
  );
};

// Hook personalizzato per utilizzare il contesto delle medicazioni
export const useVisitContext = (): UseVisitHook => {
  const context = useContext(VisitContext);
  if (context === undefined) {
    throw new Error('useVisitContext deve essere utilizzato all\'interno di un VisitProvider');
  }
  return context;
};
