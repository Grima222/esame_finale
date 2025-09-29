import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function OrdersHistory() {
  const [orders, setOrders] = useState([]);
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");

    if (role === "ADMIN") {
      // L'admin vede tutti gli ordini
      setOrders(savedOrders);
    } else {
      // L'utente vede solo i suoi ordini
      const userOrders = savedOrders.filter(order => order.username === username);
      setOrders(userOrders);
    }
  }, [username, role]);

  const handleBack = () => {
    if (role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Storico Ordini {role === "ADMIN" ? "(Tutti)" : `(di ${username})`}</h2>
        <button className="btn btn-secondary" onClick={handleBack}>
          Torna alla Dashboard
        </button>
      </div>

      {orders.length === 0 ? (
        <p>Nessun ordine trovato.</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Utente</th>
              <th>Data</th>
              <th>Prodotti</th>
              <th>Totale (€)</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.username}</td>
                <td>{order.date}</td>
                <td>
                  <ul>
                    {order.items.map((it, i) => (
                      <li key={i}>
                        {it.name} x {it.quantity} = €{it.subtotal.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>€{order.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrdersHistory;
