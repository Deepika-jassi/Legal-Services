import React, { useEffect, useState } from "react";
import "../styles/LawyerSimplePage.css";

export default function ClientDocs() {
  const [docs, setDocs] = useState([]);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_ROOT = "http://localhost:5000";
  const headers = { "Content-Type": "application/json", "x-user-role":"lawyer","x-user-id":"lawyer1" };

  const sample = [
    { id: 101, filename: "ID_proof.pdf", owner: "Alice", uploaded: new Date().toISOString() },
    { id: 102, filename: "Agreement.docx", owner: "Bob", uploaded: new Date().toISOString() },
  ];

  useEffect(()=>{
    fetchDocs();
    // eslint-disable-next-line
  },[]);

  const fetchDocs = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_ROOT}/api/lawyer/documents`, { headers });
      if (!res.ok) throw new Error("no docs");
      const d = await res.json();
      setDocs(d);
    } catch (e) {
      console.warn("docs fetch failed:", e);
      setError("Could not load client documents. Showing sample list.");
      setDocs(sample);
    } finally { setLoading(false); }
  };

  const uploadDoc = async () => {
    if (!filename) return;
    try {
      const res = await fetch(`${API_ROOT}/api/documents/upload`, {
        method: "POST",
        headers,
        body: JSON.stringify({ filename, owner: "client" }),
      });
      const json = await res.json();
      setDocs(prev => [json.document || { id: Date.now(), filename, owner: "client", uploaded: new Date().toISOString() }, ...prev]);
      setFilename("");
    } catch (e) {
      console.warn(e);
      setDocs(prev => [{ id: Date.now(), filename, owner: "client", uploaded: new Date().toISOString() }, ...prev]);
      setFilename("");
    }
  };

  const remove = async (id) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    try {
      await fetch(`${API_ROOT}/api/lawyer/documents/${id}`, { method: "DELETE", headers });
    } catch (e) { console.warn(e); }
  };

  return (
    <div className="simple-page">
      <h2>Client Documents</h2>
      <p className="muted">Access documents uploaded by clients. You can preview, download or request re-upload.</p>

      <div className="panel">
        <div className="form-row">
          <input placeholder="Document name (mock)" value={filename} onChange={e=>setFilename(e.target.value)}/>
          <button className="btn" onClick={uploadDoc}>Upload</button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? <div className="loader">Loading…</div> : (
        <div className="doc-list">
          {docs.map(d => (
            <div key={d.id} className="doc-row">
              <div>
                <strong>{d.filename}</strong> <span className="muted">by {d.owner} • {new Date(d.uploaded).toLocaleString()}</span>
              </div>
              <div>
                <button className="btn-ghost" onClick={()=>alert("Preview (mock)")}>Preview</button>
                <button className="btn-mini" onClick={()=>alert("Download (mock)")}>Download</button>
                <button className="btn-mini danger" onClick={()=>remove(d.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
