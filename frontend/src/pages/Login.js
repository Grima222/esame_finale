import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Chiamata al backend per login o per ottenere info utente
      const response = await axios.get('http://localhost:8080/api/me', {
        auth: {
          username,
          password
        }
      });

      const role = response.data.role; // "ADMIN" o "USER"

      // Salva dati in localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('role', role);

      toast.success('Login effettuato con successo!', { position: "top-right" });

      // Redirect in base al ruolo
      if (role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (role === 'USER') {
        navigate('/user', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }

    } catch (error) {
      console.error(error);
      toast.error('Username o password errati', { position: "top-right" });
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <ToastContainer />
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;
