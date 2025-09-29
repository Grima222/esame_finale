// src/pages/AdminDashboard.js
import React, { useState, useEffect, useMemo } from "react";
import { getAllItems, createItem, updateItem, deleteItem } from "../services/itemService";
import ItemModal from "../components/ItemModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaTag, FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaFileCsv, FaSyncAlt } from "react-icons/fa";
import { setPrice } from "../services/priceService";
import { useNavigate, Link } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function AdminDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [items, setItems] = useState([]);
  const [prices, setPrices] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const fetchItems = async () => {
    try {
      const data = await getAllItems();
      setItems(data || []);
      const savedPrices = JSON.parse(localStorage.getItem("itemPrices") || "{}");
      setPrices(savedPrices);
    } catch (err) {
      console.error(err);
      toast.error("Errore nel caricamento degli articoli");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handlePriceChange = (id, value) => {
    setPrices(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleSavePrices = () => {
    localStorage.setItem("itemPrices", JSON.stringify(prices));
    setPrice(prices);
    toast.success("Prezzi aggiornati correttamente!");
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo articolo?")) return;
    try {
      await deleteItem(id);
      const newPrices = { ...prices };
      delete newPrices[id];
      setPrices(newPrices);
      localStorage.setItem("itemPrices", JSON.stringify(newPrices));
      toast.success("Articolo eliminato!");
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Errore durante l'eliminazione");
    }
  };

  const handleResetPrices = () => {
    if (!window.confirm("Reimpostare tutti i prezzi a 0?")) return;
    const reset = {};
    items.forEach(it => reset[it.id] = 0);
    setPrices(reset);
    localStorage.setItem("itemPrices", JSON.stringify(reset));
    setPrice(reset);
    toast.info("Prezzi reimpostati a 0");
  };

  const exportCSV = () => {
    const headers = ["id", "name", "quantity", "price"];
    const rows = items.map(it => [it.id, `"${it.name.replace(/"/g, '""')}"`, it.quantity, (prices[it.id] ?? 0).toFixed(2)]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prodotti_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const totalProducts = items.length;
    const available = items.filter(i => i.quantity > 0).length;
    const out = items.filter(i => i.quantity === 0).length;
    const avgPrice = items.length === 0 ? 0 : items.reduce((s,it) => s + (prices[it.id] ?? 0), 0) / items.length;
    return { totalProducts, available, out, avgPrice };
  }, [items, prices]);

  const barData = useMemo(() => items.map(it => ({ name: it.name.length > 12 ? it.name.slice(0,11)+"…" : it.name, quantity: it.quantity })), [items]);
  const pieData = useMemo(() => [{ name: "Disponibili", value: stats.available }, { name: "Esauriti", value: stats.out }], [stats]);

  const filtered = useMemo(() => {
    let arr = items.map(it => ({ ...it, price: prices[it.id] ?? 0 }))
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "available" ? item.quantity > 0 : filter === "out" ? item.quantity === 0 : true;
        return matchesSearch && matchesFilter;
      });

    if (sortField) {
      arr.sort((a,b) => {
        let va = sortField==="name" ? (a[sortField] || "").toString().toLowerCase() : Number(a[sortField] || 0);
        let vb = sortField==="name" ? (b[sortField] || "").toString().toLowerCase() : Number(b[sortField] || 0);
        if(va<vb) return sortDir==="asc"?-1:1;
        if(va>vb) return sortDir==="asc"?1:-1;
        return 0;
      });
    }
    return arr;
  }, [items, prices, searchTerm, filter, sortField, sortDir]);

  const toggleSort = (field) => {
    if(sortField===field) setSortDir(d => d==="asc"?"desc":"asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <ToastContainer />

      <aside className="bg-light border-end" style={{ width: 220, minHeight: "100vh", padding: "1rem" }}>
        <div className="mb-4">
          <h5 className="fw-bold">⚙️ Gestionale</h5>
          <small className="text-muted">Admin: {username}</small>
        </div>

        <nav className="nav flex-column">
          <Link className="nav-link active fw-bold" to="#dashboard">🏠 Dashboard</Link>
          <Link className="nav-link" to="#prodotti">📦 Prodotti</Link>
          <Link className="nav-link" to="#prezzi">💶 Prezzi</Link>
          <Link className="nav-link" to="/report">📊 Report</Link>
          <Link className="nav-link" to="#utenti">👤 Utenti</Link>
        </nav>

        <div className="mt-4">
          <button className="btn btn-outline-secondary w-100 mb-2" onClick={exportCSV}><FaFileCsv className="me-2"/> Esporta CSV</button>
          <button className="btn btn-outline-danger w-100" onClick={handleResetPrices}><FaSyncAlt className="me-2"/> Reset Prezzi</button>
        </div>
      </aside>

      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4" id="dashboard">
          <h1 className="h4 mb-0">Admin Dashboard</h1>
          <button className="btn btn-light me-2" onClick={handleLogout}><FaSignOutAlt /></button>
        </div>

        {/* Stat cards */}
        <div className="row mb-4">
          {["Totale Prodotti","Disponibili","Esauriti","Prezzo Medio"].map((title,idx)=>(
            <div className="col-md-3 mb-3" key={idx}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title">{title}</h6>
                  <h3 className="fw-bold">
                    {title==="Totale Prodotti"? stats.totalProducts :
                     title==="Disponibili"? <span className="text-success">{stats.available}</span> :
                     title==="Esauriti"? <span className="text-danger">{stats.out}</span> :
                     `€${stats.avgPrice.toFixed(2)}`}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Controls */}
        <div className="d-flex align-items-center mb-3" id="prodotti">
          <div className="input-group me-3" style={{ maxWidth: 360 }}>
            <span className="input-group-text bg-white"><FaSearch /></span>
            <input className="form-control" placeholder="Cerca articolo..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
          </div>
          <select className="form-select me-3" style={{ maxWidth: 180 }} value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">Tutti</option>
            <option value="available">Disponibili</option>
            <option value="out">Esauriti</option>
          </select>

          <div className="btn-group me-3" role="group">
            {["name","quantity","price"].map(f=>(
              <button key={f} className={`btn btn-outline-secondary ${sortField===f?"active":""}`} onClick={()=>toggleSort(f)}>
                Ordina {f} {sortField===f?(sortDir==="asc"?"↑":"↓"):""}
              </button>
            ))}
          </div>

          <button className="btn btn-primary ms-auto" onClick={()=>{setSelectedItem(null); setShowModal(true);}}>
            <FaPlus className="me-1"/> Aggiungi Articolo
          </button>
        </div>

        {/* Product Grid */}
        <div className="row" id="prezzi">
          {filtered.map(item=>(
            <div key={item.id} className="col-md-4 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title fw-bold"><FaTag className="me-2 text-success"/>{item.name}</h5>
                    <small className="text-muted">ID: {item.id}</small>
                  </div>
                  <p className="mb-1">Quantità: <strong className={item.quantity===0?"text-danger":""}>{item.quantity}</strong></p>
                  <div className="input-group mb-3" style={{ maxWidth: 200 }}>
                    <span className="input-group-text">€</span>
                    <input type="number" className="form-control" value={prices[item.id]??""} onChange={e=>handlePriceChange(item.id,e.target.value)}/>
                  </div>
                  <div className="mt-auto d-flex justify-content-between">
                    <button className="btn btn-warning btn-sm" onClick={()=>{setSelectedItem(item); setShowModal(true);}}>
                      <FaEdit className="me-1"/> Modifica
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(item.id)}>
                      <FaTrash className="me-1"/> Elimina
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length===0 && <div className="col-12"><p className="text-center text-muted">Nessun articolo trovato</p></div>}
        </div>

        {/* Save Prices */}
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-success me-2" onClick={handleSavePrices}>💾 Salva prezzi</button>
          <button className="btn btn-outline-secondary" onClick={exportCSV}><FaFileCsv className="me-1"/> Esporta CSV</button>
        </div>

        {/* Section Utenti */}
        <div className="row mt-5" id="utenti">
          <div className="col-12">
            <h3>👤 Utenti</h3>
            <p>Qui verranno mostrati gli utenti del sistema (da implementare).</p>
          </div>
        </div>

        {/* Modal */}
        {showModal && <ItemModal show={showModal} onClose={()=>setShowModal(false)} onSave={()=>{setShowModal(false); fetchItems();}} item={selectedItem}/>}
      </main>
    </div>
  );
}

export default AdminDashboard;
