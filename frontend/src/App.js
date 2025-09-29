// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // Importiamo la nuova pagina
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OrdersHistory from './pages/OrdersHistory';
import ReportPage from './pages/ReportPage';

function App() {
  const getRole = () => localStorage.getItem('role'); // Legge sempre il ruolo corrente

  // PrivateRoute aggiornato per più ruoli
  const PrivateRoute = ({ children, allowedRoles }) => {
    const role = getRole();
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Pagine pubbliche */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pagine protette */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/user"
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <UserDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute allowedRoles={['USER', 'ADMIN']}>
              <OrdersHistory />
            </PrivateRoute>
          }
        />

        <Route
          path="/report"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <ReportPage />
            </PrivateRoute>
          }
        />

        {/* Redirect per tutte le altre rotte */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    
  );
}

export default App;
