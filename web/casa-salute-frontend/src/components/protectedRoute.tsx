import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute: React.FC<any> = ({ children }) => {
  const { user, logout } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  } else if (parseInt(user.expire) < Date.now()) {
    logout()
  }
  return children;
};
