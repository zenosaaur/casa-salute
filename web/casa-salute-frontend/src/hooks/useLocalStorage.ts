import { useState } from "react";

// Definizione del tipo per il valore memorizzato
type StoredValue<T> = [T, (newValue: T) => void];

// Hook per la gestione del local storage
export const useLocalStorage = <T>(keyName: string, defaultValue: T): StoredValue<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value) as T;
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  // Funzione per impostare il valore nel local storage
  const setValue = (newValue: T) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.error(err);
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};
