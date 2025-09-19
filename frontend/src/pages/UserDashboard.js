import React, { useState, useEffect } from 'react';
import { getAllItems } from '../services/itemService';
import { generateOrderPDF } from '../services/OrderPDF';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});

  // Redirect se non è loggato o ruolo errato
  useEffect(() => {
    if (!username || role !== 'USER') {
      navigate('/login', { replace: true });
    }
  }, [username, role, navigate]);

  // Carica articoli e prezzi dal backend + localStorage
  const fetchItems = async () => {
    try {
      const data = await getAllItems();
      const savedPrices = JSON.parse(localStorage.getItem('itemPrices') || "{}");

      const itemsWithPrice = data.map(item => ({
        ...item,
        price: savedPrices[item.id] ?? 0
      }));

      setItems(itemsWithPrice);
    } catch (err) {
      console.error(err);
      toast.error('Errore nel caricamento degli articoli');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleQuantityChange = (id, quantity) => {
    setCart(prev => ({ ...prev, [id]: parseInt(quantity) || 0 }));
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

  const totalOrder = items.reduce(
    (sum, item) => sum + ((cart[item.id] || 0) * (item.price || 0)),
    0
  );

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Dashboard Cliente</h2>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
      <p>Benvenuto, {username}!</p>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>Disponibilità</th>
            <th>Prezzo (€)</th>
            <th>Quantità da ordinare</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price?.toFixed(2) || '0.00'}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max={item.quantity}
                  value={cart[item.id] || 0}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="form-control"
                  style={{ width: '80px' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <h5>Totale: €{totalOrder.toFixed(2)}</h5>
        <button
          className="btn btn-success"
          onClick={() => generateOrderPDF(username, items, cart)}
        >
          Scarica Ricevuta PDF
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
