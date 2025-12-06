import React, { useEffect, useState } from "react";
import "../styles/LawyerAppointments.css"; // <-- ensure this path matches where you put the css

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");

  const API_ROOT = "http://localhost:5000"; // explicit backend root

  const defaultHeaders = {
    "Content-Type": "application/json",
    "x-user-role": "lawyer",
    "x-user-id": "lawyer1",
  };

  // sample fallback data (used if backend fetch fails)
  const sampleData = [
    {
      id: 1,
      lawyerId: "lawyer1",
      client: "Alice",
      datetime: new Date().toISOString(),
      status: "pending",
      notes: "Discuss contract terms",
      service: "Contract Drafting"
    },
    {
      id: 2,
      lawyerId: "lawyer1",
      client: "Bob",
      datetime: new Date(Date.now() + 86400000).toISOString(),
      status: "accepted",
      notes: "Initial consultation",
      service: "Legal Consultation"
    },
    {
      id: 3,
      lawyerId: "lawyer1",
      client: "Deepika Jassi",
      datetime: new Date(Date.now() + 86400000).toISOString(),
      status: "accepted",
      notes: "Initial consultation",
      service: "Property Agreement Review"
    },
  ];

  useEffect(() => {
    fetchAppointments();

    // Light polling: refresh every 5 seconds so new appointments (created by users) appear
    const interval = setInterval(() => {
      fetchAppointments();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_ROOT}/api/lawyer/appointments`, {
        headers: defaultHeaders,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} ${txt}`);
      }
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("fetchAppointments error:", err);
      setError("Could not load appointments. Check backend or network.");
      // fallback to sample so UI isn't empty
      setAppointments(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setActionLoading(id);
    setError("");
    try {
      const res = await fetch(
        `${API_ROOT}/api/lawyer/appointments/${id}/status`,
        {
          method: "POST",
          headers: defaultHeaders,
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} ${txt}`);
      }
      const json = await res.json();
      // backend returns updated appointment in json.appointment (as sample server does)
      const updated = json.appointment || { id, status };
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      console.error("updateStatus error:", err);
      setError("Action failed. See console for details.");
      // optimistic local update fallback:
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } finally {
      setActionLoading(null);
    }
  };

  const openDetails = (appt) => {
    setSelected(appt);
    setRescheduleDate("");
  };

  const closeDetails = () => {
    setSelected(null);
  };

  const submitReschedule = async () => {
    if (!rescheduleDate) return;
    const id = selected.id;
    try {
      // attempt POST to backend (rescheduleTo handled by backend if implemented)
      await fetch(`${API_ROOT}/api/lawyer/appointments/${id}/status`, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify({ status: "accepted", rescheduleTo: rescheduleDate }),
      });
    } catch (err) {
      console.warn("reschedule backend error (ignored):", err);
    }
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, datetime: new Date(rescheduleDate).toISOString(), status: "accepted" } : a
      )
    );
    closeDetails();
  };

  // filtered + searched results
  const filtered = appointments.filter((a) => {
    if (!a) return false;
    if (filter !== "all" && a.status !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      String(a.id).includes(q) ||
      (a.client && a.client.toLowerCase().includes(q)) ||
      (a.notes && a.notes.toLowerCase().includes(q)) ||
      (a.service && a.service.toLowerCase().includes(q))
    );
  });

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <h2>My Appointments</h2>
        <p className="muted">Manage client meetings and requests. Accept, reject or mark complete.</p>

        <div className="top-controls">
          <div className="filters">
            {["all", "pending", "accepted", "completed", "rejected"].map((f) => (
              <button
                key={f}
                className={`chip ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="search">
            <input
              placeholder="Search by client, service or id..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}
      </div>

      {loading ? (
        <div className="loader">Loading appointments…</div>
      ) : filtered.length === 0 ? (
        <div className="empty">No appointments match your criteria.</div>
      ) : (
        <div className="appointments-list">
          {filtered.map((a) => (
            <div key={a.id} className={`appointment-card ${a.status}`}>
              <div className="ap-left">
                <div className="ap-client">{a.client || "Client"}</div>
                <div className="ap-service">Service: {a.service || "—"}</div>
                <div className="ap-datetime">{new Date(a.datetime).toLocaleString()}</div>
                <div className="ap-meta">Request ID: {a.id}</div>
                {a.notes && <div className="ap-notes">{a.notes}</div>}
              </div>

              <div className="ap-right">
                <div className="ap-status">
                  Status: <span className={`status-pill ${a.status}`}>{a.status}</span>
                </div>

                <div className="ap-actions">
                  <button className="btn-secondary" onClick={() => openDetails(a)}>Details</button>

                  {a.status === "pending" && (
                    <>
                      <button
                        className="btn-accept"
                        disabled={actionLoading === a.id}
                        onClick={() => updateStatus(a.id, "accepted")}
                      >
                        {actionLoading === a.id ? "..." : "Accept"}
                      </button>

                      <button
                        className="btn-reject"
                        disabled={actionLoading === a.id}
                        onClick={() => updateStatus(a.id, "rejected")}
                      >
                        {actionLoading === a.id ? "..." : "Reject"}
                      </button>
                    </>
                  )}

                  {a.status === "accepted" && (
                    <button
                      className="btn-complete"
                      disabled={actionLoading === a.id}
                      onClick={() => updateStatus(a.id, "completed")}
                    >
                      {actionLoading === a.id ? "..." : "Mark Complete"}
                    </button>
                  )}

                  {["rejected", "completed"].includes(a.status) && <div className="muted">{a.status}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* details modal */}
      {selected && (
        <div className="modal-backdrop" onClick={closeDetails}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Appointment Details</h3>
            <p><b>Client:</b> {selected.client}</p>
            <p><b>Service:</b> {selected.service || "—"}</p>
            <p><b>Date & Time:</b> {new Date(selected.datetime).toLocaleString()}</p>
            <p><b>Notes:</b> {selected.notes || "—"}</p>

            <div className="modal-row">
              <label>Reschedule to:</label>
              <input
                type="datetime-local"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn" onClick={submitReschedule}>Reschedule & Accept</button>
              <button className="btn btn-outline" onClick={closeDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
