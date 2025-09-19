import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Cancella tutte le info salvate
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('role');

    // Reindirizza al login
    navigate('/login');
  }, [navigate]);

  return null; // Non serve renderizzare nulla
}

export default Logout;
