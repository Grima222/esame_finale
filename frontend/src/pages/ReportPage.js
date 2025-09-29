// src/pages/ReportPage.js
import React, { useState, useEffect, useMemo } from "react";
import { getAllItems } from "../services/itemService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function ReportPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const data = await getAllItems();
      setItems(data || []); 
    } catch (err) {
      console.error(err);
      toast.error("Errore nel caricamento degli articoli");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Statistiche
  const stats = useMemo(() => {
    const safeItems = items || [];
    const totalProducts = safeItems.length;
    const available = safeItems.filter((i) => i.quantity > 0).length;
    const out = safeItems.filter((i) => i.quantity === 0).length;
    return { totalProducts, available, out };
  }, [items]);

  // Grafici
  const barData = useMemo(() => {
    const safeItems = items || [];
    return safeItems.map((it) => ({
      name: it.name.length > 12 ? it.name.slice(0, 11) + "…" : it.name,
      quantity: it.quantity || 0,
    }));
  }, [items]);

  const pieData = useMemo(() => [
    { name: "Disponibili", value: stats.available },
    { name: "Esauriti", value: stats.out },
  ], [stats]);

  // Pulsanti
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <ToastContainer />

      {/* Sidebar */}
      <aside className="bg-light border-end" style={{ width: 220, padding: "1rem" }}>
        <div className="mb-4">
          <h5 className="fw-bold">📊 Report</h5>
        </div>

        <nav className="nav flex-column">
          <Link className="nav-link" to="/admin">🏠 Dashboard</Link>
          <button className="btn btn-danger mt-3" onClick={handleLogout}>🚪 Logout</button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 p-4">
        <h1 className="h4 mb-4">📊 Report Prodotti</h1>

        {/* Stat cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title">Totale Prodotti</h6>
                <h3 className="fw-bold">{stats.totalProducts}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title">Disponibili</h6>
                <h3 className="fw-bold text-success">{stats.available}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title">Esauriti</h6>
                <h3 className="fw-bold text-danger">{stats.out}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Grafici */}
        <div className="row mb-4">
          <div className="col-lg-6 mb-3">
            <div className="card shadow-sm p-3 h-100">
              <h6 className="fw-bold">Quantità per prodotto</h6>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#36a2eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-3">
            <div className="card shadow-sm p-3 h-100">
              <h6 className="fw-bold">Disponibilità</h6>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportPage;
