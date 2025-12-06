import React, { useState } from "react";
import "../styles/Documents.css";

function Documents() {
  const [docs, setDocs] = useState([]);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const uploadDoc = async () => {
    if (!filename.trim()) {
      setMsg("Please enter a document name.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/documents/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, owner: "user1" }),
      });
      const data = await res.json();
      setDocs((prev) => [...prev, data.document]);
      setFilename("");
      setMsg("Uploaded successfully");
    } catch (err) {
      setMsg("Upload failed. Try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 2500);
    }
  };

  return (
    <div className="docs-wrapper">
      <div className="docs-card">
        <h2>Documents</h2>

        <div className="upload-row">
          <input
            type="text"
            placeholder="Document name (e.g. Contract.pdf)"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="input-doc"
          />
          <button
            className="btn-upload"
            onClick={uploadDoc}
            disabled={loading}
          >
            {loading ? "Uploading…" : "Upload"}
          </button>
        </div>

        {msg && <p className="docs-msg">{msg}</p>}

        <div className="docs-list">
          {docs.length === 0 ? (
            <p className="empty">No documents uploaded yet.</p>
          ) : (
            <ul>
              {docs.map((doc) => (
                <li key={doc.id} className="doc-item">
                  <span className="doc-name">{doc.filename}</span>
                  <span className="doc-meta">ID: {doc.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Documents;
