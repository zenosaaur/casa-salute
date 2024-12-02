
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home'
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from "@/components/protectedRoute";
import { GuestRoute } from "@/components/guestRoute"
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
