import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logout effettuato con successo!', { position: toast.POSITION.TOP_RIGHT });
    setTimeout(() => {
      navigate('/login');
    }, 1000); // piccolo delay per far vedere il toast
  };

  const roleColor = role === 'ADMIN' ? 'danger' : 'primary';

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">Gestionale</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              {role === 'ADMIN' && (
                <li className="nav-item">
                  <a className="nav-link" href="/admin">Dashboard Admin</a>
                </li>
              )}
              {role === 'USER' && (
                <li className="nav-item">
                  <a className="nav-link" href="/user">Dashboard User</a>
                </li>
              )}
            </ul>
            {username && (
              <div className="d-flex align-items-center">
                <span className="navbar-text me-2">{`Ciao, ${username}`}</span>
                <span className={`badge bg-${roleColor} me-3`}>{role}</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
