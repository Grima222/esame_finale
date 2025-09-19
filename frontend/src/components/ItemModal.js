import React, { useState, useEffect } from 'react';
import { createItem, updateItem } from '../services/itemService';

function ItemModal({ show, onClose, onSave, item }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setPrice(item.price || 0);
    } else {
      setName('');
      setQuantity(0);
      setPrice(0);
    }
  }, [item]);

  const handleSave = async () => {
    if (!name || quantity < 0 || price < 0) {
      setError('Nome, quantità e prezzo validi sono obbligatori');
      return;
    }
    try {
      if (item) {
        await updateItem(item.id, name, parseInt(quantity));
        // Salvo il prezzo nel localStorage
        const savedPrices = JSON.parse(localStorage.getItem('itemPrices') || "{}");
        savedPrices[item.id] = parseFloat(price);
        localStorage.setItem('itemPrices', JSON.stringify(savedPrices));
      } else {
        const newItem = await createItem(name, parseInt(quantity));
        // Assegno prezzo al nuovo articolo
        const savedPrices = JSON.parse(localStorage.getItem('itemPrices') || "{}");
        savedPrices[newItem.id] = parseFloat(price);
        localStorage.setItem('itemPrices', JSON.stringify(savedPrices));
      }
      onSave();
      onClose();
    } catch (err) {
      setError('Errore durante il salvataggio');
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{item ? 'Modifica Articolo' : 'Nuovo Articolo'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <input
              type="text"
              placeholder="Nome articolo"
              className="form-control mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantità"
              className="form-control mb-2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <input
              type="number"
              placeholder="Prezzo (€)"
              className="form-control mb-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Annulla</button>
            <button className="btn btn-primary" onClick={handleSave}>Salva</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
