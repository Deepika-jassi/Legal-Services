// frontend/src/pages/VerifyAdmin.js
import React, { useEffect, useState } from "react";

export default function VerifyAdmin() {
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/verification/status/"); // not implemented: we use file DB listing via a helper route - but we'll call the file directly (read below)
      // If you don't have a listing route, we can request known IDs or use curl admin.
      setLoading(false);
      setEntries({});
    } catch (e) {
      setLoading(false);
      setEntries({});
    }
  };

  const adminApprove = async (userId) => {
    await fetch(`/api/verification/admin/${userId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-role": "admin" },
      body: JSON.stringify({ action: "approve" })
    });
    alert("Approved (demo). Refresh to see status.");
  };

  const adminReject = async (userId) => {
    await fetch(`/api/verification/admin/${userId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-role": "admin" },
      body: JSON.stringify({ action: "reject" })
    });
    alert("Rejected (demo). Refresh to see status.");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Verification Admin (demo)</h2>
      <p>This admin panel is minimal — use curl or Postman to approve specific user IDs.</p>

      <div style={{ marginTop: 16 }}>
        <p>Approve a user by ID (example: <code>lawyer1</code>)</p>
        <button onClick={() => adminApprove("lawyer1")}>Approve lawyer1</button>
        <button style={{ marginLeft: 8 }} onClick={() => adminReject("lawyer1")}>Reject lawyer1</button>
      </div>

      <p style={{ marginTop: 18, color: "#666" }}>
        NOTE: For a real admin UI you would list pending entries via a backend "list" endpoint and show uploaded docs.
      </p>
    </div>
  );
}
