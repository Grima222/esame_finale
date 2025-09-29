// src/pages/UserDashboard.js
import React, { useState, useEffect } from "react";
import { getAllItems } from "../services/itemService";
import { generateOrderPDF } from "../services/OrderPDF";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaTag, FaShoppingCart, FaTrash, FaHistory } from "react-icons/fa";

function UserDashboard() {
  const username = localStorage.getItem("username");
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Carica articoli e prezzi aggiornati
  const fetchItems = async () => {
    try {
      const data = await getAllItems();
      const savedPrices = JSON.parse(localStorage.getItem("itemPrices") || "{}");
      const itemsWithPrice = data.map((item) => ({
        ...item,
        price: savedPrices[item.id] ?? 0,
      }));
      setItems(itemsWithPrice);
    } catch (err) {
      console.error(err);
      toast.error("Errore nel caricamento degli articoli");
    }
  };

  useEffect(() => {
    fetchItems();
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  const handleQuantityChange = (id, quantity) => {
    setCart((prev) => {
      const updated = { ...prev, [id]: parseInt(quantity) || 0 };
      if (updated[id] === 0) delete updated[id];
      return updated;
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "available" ? item.quantity > 0 : filter === "out" ? item.quantity === 0 : true;
    return matchesSearch && matchesFilter;
  });

  const cartItems = items.filter((item) => cart[item.id] > 0);

  const totalOrder = cartItems.reduce((sum, item) => sum + cart[item.id] * (item.price || 0), 0);

  const handleGenerateOrder = () => {
    if (totalOrder === 0) return;

    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: cart[item.id],
        price: item.price,
      })),
      total: totalOrder,
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    generateOrderPDF(username, items, cart);
    setCart({});
    toast.success("Ordine salvato e PDF generato ✅");
  };

  return (
    <div className="container-fluid mt-4">
      <ToastContainer />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-success text-white rounded">
        <h2 className="fw-bold">
          <FaShoppingCart className="me-2" /> Dashboard Cliente
        </h2>
        <button className="btn btn-light fw-bold" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row">
        {/* Lista prodotti */}
        <div className="col-md-8">
          <div className="d-flex mb-4">
            <div className="input-group me-3" style={{ maxWidth: "300px" }}>
              <span className="input-group-text bg-white">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Cerca articolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              style={{ maxWidth: "200px" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Tutti</option>
              <option value="available">Disponibili</option>
              <option value="out">Esauriti</option>
            </select>
          </div>

          <div className="row">
            {filteredItems.map((item) => (
              <div key={item.id} className="col-md-6 mb-3">
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">
                      <FaTag className="me-2 text-success" />
                      {item.name}
                    </h5>
                    <p className="card-text fw-bold">
                      Quantità:{" "}
                      <span className={item.quantity === 0 ? "text-danger" : "text-dark"}>
                        {item.quantity === 0 ? "Esaurito" : item.quantity}
                      </span>
                    </p>
                    <p className="card-text fw-bold">Prezzo: €{item.price?.toFixed(2) || "0.00"}</p>
                    <input
                      type="number"
                      min="0"
                      max={item.quantity}
                      value={cart[item.id] || 0}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="form-control mb-2"
                      placeholder="Quantità"
                      disabled={item.quantity === 0}
                    />
                  </div>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <p className="text-center text-muted">Nessun articolo trovato</p>
            )}
          </div>
        </div>

        {/* Carrello + storico ordini */}
        <div className="col-md-4">
          <div className="card shadow-sm sticky-top mb-3" style={{ top: "20px" }}>
            <div className="card-body">
              <h4 className="fw-bold mb-3">🛒 Carrello</h4>
              {cartItems.length === 0 ? (
                <p className="text-muted">Il carrello è vuoto</p>
              ) : (
                <ul className="list-group mb-3">
                  {cartItems.map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{item.name}</strong> x {cart[item.id]}
                        <br />
                        <small className="text-muted">€{(cart[item.id] * item.price).toFixed(2)}</small>
                      </div>
                      <button className="btn btn-sm btn-danger" onClick={() => handleRemoveFromCart(item.id)}>
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <h5 className="fw-bold">Totale: €{totalOrder.toFixed(2)}</h5>
              <button className="btn btn-success w-100 mt-3 fw-bold" onClick={handleGenerateOrder} disabled={totalOrder === 0}>
                📄 Conferma e Scarica PDF
              </button>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="fw-bold mb-3">
                <FaHistory className="me-2" /> Storico Ordini
              </h4>
              {orders.length === 0 ? (
                <p className="text-muted">Nessun ordine effettuato</p>
              ) : (
                <ul className="list-group">
                  {orders.map((order) => (
                    <li key={order.id} className="list-group-item">
                      <div>
                        <strong>{order.date}</strong>
                        <br />
                        Totale: €{order.total.toFixed(2)}
                        <ul className="small text-muted mt-1">
                          {order.items.map((p, i) => (
                            <li key={i}>
                              {p.name} x {p.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
