import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * roleRequired: ruolo necessario per accedere alla rotta
 * userRole: ruolo dell'utente loggato (dal localStorage)
 * element: componente da renderizzare se accesso consentito
 */
function PrivateRoute({ element, roleRequired }) {
  const userRole = localStorage.getItem('role');

  if (!userRole) {
    // Non loggato
    return <Navigate to="/login" />;
  }

  if (roleRequired && userRole !== roleRequired) {
    // Loggato ma ruolo non corretto
    return <Navigate to="/access-denied" />;
  }

  return element;
}

export default PrivateRoute;
