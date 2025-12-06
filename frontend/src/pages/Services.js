import React, { useEffect, useState } from "react";
import "../styles/LawyerSimplePage.css"; // shared style file

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", price: "", description: "" });

  const API_ROOT = "http://localhost:5000";
  const headers = {
    "Content-Type": "application/json",
    "x-user-role": "lawyer",
    "x-user-id": "lawyer1",
  };

  const sample = [
    { id: 1, title: "Contract Drafting", price: "₹2,500", description: "Draft business contracts", active: true },
    { id: 2, title: "Legal Consultation", price: "₹1,000", description: "30-min consultation", active: true },
  ];

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, []);

  async function fetchServices() {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_ROOT}/api/lawyer/services`, { headers });
      if (!res.ok) throw new Error("no services");
      const data = await res.json();
      setServices(data);
    } catch (e) {
      console.warn("services fetch failed:", e);
      setError("Could not load services. Using sample data.");
      setServices(sample);
    } finally { setLoading(false); }
  }

  const save = async () => {
    // if editing exists update, else add
    if (!form.title) return;
    if (editing) {
      // attempt backend update
      try {
        await fetch(`${API_ROOT}/api/lawyer/services/${editing.id}`, {
          method: "POST",
          headers,
          body: JSON.stringify(form),
        });
      } catch (e) { console.warn(e); }
      setServices(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s));
    } else {
      const newS = { id: Date.now(), ...form, active: true };
      try {
        await fetch(`${API_ROOT}/api/lawyer/services`, { method: "POST", headers, body: JSON.stringify(newS) });
      } catch (e) { console.warn(e); }
      setServices(prev => [newS, ...prev]);
    }
    setForm({ title: "", price: "", description: "" });
    setEditing(null);
  };

  const toggleActive = async (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    try {
      await fetch(`${API_ROOT}/api/lawyer/services/${id}/toggle`, { method: "POST", headers });
    } catch (e) { console.warn(e); }
  };

  const remove = async (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    try {
      await fetch(`${API_ROOT}/api/lawyer/services/${id}`, { method: "DELETE", headers });
    } catch (e) { console.warn(e); }
  };

  return (
    <div className="simple-page">
      <h2>My Services</h2>
      <p className="muted">Manage the legal services you provide. Add pricing, edit descriptions, enable/disable services.</p>

      <div className="panel">
        <div className="form-row">
          <input placeholder="Service title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})}/>
          <input placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})}/>
        </div>
        <textarea placeholder="Short description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})}/>
        <div className="row-right">
          {editing && <button className="btn btn-outline" onClick={()=>{setEditing(null); setForm({title:"",price:"",description:""});}}>Cancel</button>}
          <button className="btn" onClick={save}>{editing ? "Save changes" : "Add Service"}</button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading ? <div className="loader">Loading…</div> : (
        <div className="cards-grid">
          {services.map(s => (
            <div key={s.id} className="card-small">
              <h3>{s.title}</h3>
              <p className="price">{s.price || "—"}</p>
              <p className="desc">{s.description}</p>
              <div className="card-actions">
                <button className="btn-ghost" onClick={()=>{ setEditing(s); setForm({title:s.title,price:s.price,description:s.description}); }}>Edit</button>
                <button className={`btn-mini ${s.active ? "" : "muted"}`} onClick={()=>toggleActive(s.id)}>{s.active ? "Disable" : "Enable"}</button>
                <button className="btn-mini danger" onClick={()=>remove(s.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
