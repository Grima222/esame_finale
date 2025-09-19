import React, { useState, useEffect } from 'react';
import { getAllItems, deleteItem } from '../services/itemService';
import { generateOrderPDF } from '../services/OrderPDF';
import ItemModal from '../components/ItemModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const username = localStorage.getItem('username');
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  // Carica articoli dal backend e unisci con i prezzi salvati localmente
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

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo articolo?')) return;
    try {
      await deleteItem(id);

      // Rimuovo anche eventuale prezzo salvato localmente
      const savedPrices = JSON.parse(localStorage.getItem('itemPrices') || "{}");
      delete savedPrices[id];
      localStorage.setItem('itemPrices', JSON.stringify(savedPrices));

      toast.success('Articolo eliminato');
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Errore durante l\'eliminazione');
    }
  };

  const handleQuantityChange = (id, quantity) => {
    setCart(prev => ({ ...prev, [id]: parseInt(quantity) || 0 }));
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const totalOrder = items.reduce((sum, item) => sum + ((cart[item.id] || 0) * (item.price || 0)), 0);

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Dashboard Admin</h2>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
      <p>Benvenuto, {username}!</p>

      <button className="btn btn-primary mb-3" onClick={() => { setSelectedItem(null); setShowModal(true); }}>
        Nuovo Articolo
      </button>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Quantità Disponibile</th>
            <th>Prezzo (€)</th>
            <th>Quantità Ordine</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
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
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Modifica</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <h5>Totale ordine: €{totalOrder.toFixed(2)}</h5>
        <button className="btn btn-success" onClick={() => generateOrderPDF('ClienteEsempio', items, cart)}>
          Genera PDF Ordine
        </button>
      </div>

      <ItemModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={fetchItems}
        item={selectedItem}
      />
    </div>
  );
}

export default AdminDashboard;
