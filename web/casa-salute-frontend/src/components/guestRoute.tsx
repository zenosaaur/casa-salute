
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const GuestRoute: React.FC<any> = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    // user is not authenticated
    return <Navigate to="/dashboard" />;
  }
  return children;
};
