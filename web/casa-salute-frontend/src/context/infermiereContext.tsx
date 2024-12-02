
import React, { ReactNode, createContext, useContext } from 'react';
import useInfermiere, { UseInfermiereHook } from '@/hooks/useInfermiere';

interface InfermiereProviderProps {
  children: ReactNode;
}

// Creazione del contesto per le medicazioni
const InfermiereContext = createContext<UseInfermiereHook | undefined>(undefined);

// Provider del contesto per le medicazioni
export const InfermiereProvider: React.FC<InfermiereProviderProps> = ({ children }) => {
  const infermiereHook = useInfermiere();

  return (
    <InfermiereContext.Provider value={infermiereHook}>
      {children}
    </InfermiereContext.Provider>
  );
};

// Hook personalizzato per utilizzare il contesto delle medicazioni
export const useInfermiereContext = (): UseInfermiereHook => {
  const context = useContext(InfermiereContext);
  if (context === undefined) {
    throw new Error('useInfermiereContext deve essere utilizzato all\'interno di un InfermiereProvider');
  }
  return context;
};
