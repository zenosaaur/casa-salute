import React, { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

export interface UserAuth {
  token: string,
  utente: string
  expire: string
  ruolo: string
  responsabile: string | undefined
}

interface AuthContextType {
  user: UserAuth | null;
  login: (data: UserAuth) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = useLocalStorage<UserAuth | null>("user", null);

  const navigate = useNavigate();

  // chiamare questa funzione quando si vuole autenticare l'utente
  const login = async (data: UserAuth) => {
    setUser(data);
    navigate("/dashboard", { replace: true });
  };

  // chiamare questa funzione per disconnettere l'utente loggato
  const logout = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
