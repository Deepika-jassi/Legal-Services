// frontend/src/pages/LawyerVerify.js
import React, { useState, useEffect } from "react";
import "./LawyerVerify.css";

/*
  Use explicit API base so we avoid CRA proxy confusion while debugging.
  You can also set REACT_APP_API in .env to point elsewhere.
*/
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

export default function LawyerVerify() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });
  const userId = user?.id || "demo-lawyer";

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [status, setStatus] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loadingAction, setLoadingAction] = useState(""); // which action is running

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line
  }, [userId]);

  async function safeJson(res) {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return { _raw: text }; }
  }

  const fetchStatus = async () => {
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/verification/status/${userId}`);
      if (!res.ok) {
        const parsed = await safeJson(res);
        throw new Error(parsed.error || `HTTP ${res.status}`);
      }
      const j = await res.json();
      setStatus(j.entry || null);
      console.log("fetchStatus:", j);
    } catch (err) {
      console.error("fetchStatus error:", err);
      setMsg("Could not fetch verification status. Check backend.");
    }
  };

  const requestOtp = async () => {
    setMsg("");
    setLoadingAction("requestOtp");
    try {
      const res = await fetch(`${API_BASE}/api/verification/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, phone }),
      });
      const j = await safeJson(res);
      if (!res.ok) throw new Error(j.error || j._raw || `HTTP ${res.status}`);
      setMsg(j.message || "OTP requested");
      // show debug OTP if present (only in demo)
      if (j.debugOtp) setMsg((p) => `${p} (debug OTP: ${j.debugOtp})`);
      console.log("requestOtp response:", j);
    } catch (err) {
      console.error("requestOtp error:", err);
      setMsg("Failed to request OTP. See console.");
    } finally {
      setLoadingAction("");
    }
  };

  const confirmOtp = async () => {
    setMsg("");
    setLoadingAction("confirmOtp");
    try {
      const res = await fetch(`${API_BASE}/api/verification/confirm-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });
      const j = await safeJson(res);
      if (!res.ok) throw new Error(j.error || j._raw || `HTTP ${res.status}`);
      setMsg(j.message || "OTP confirmed");
      console.log("confirmOtp response:", j);
      await fetchStatus();
    } catch (err) {
      console.error("confirmOtp error:", err);
      setMsg("Failed to confirm OTP. See console.");
    } finally {
      setLoadingAction("");
    }
  };

  const uploadId = async () => {
    if (!file) {
      setMsg("Pick a file first");
      return;
    }
    setMsg("");
    setLoadingAction("uploadId");
    try {
      const fd = new FormData();
      fd.append("userId", userId);
      fd.append("file", file);

      const res = await fetch(`${API_BASE}/api/verification/upload-id`, {
        method: "POST",
        // DO NOT set Content-Type; browser sets multipart boundary automatically
        // include headers if your backend expects x-user-id or role:
        // headers: { "x-user-id": userId, "x-user-role": "lawyer" },
        body: fd,
      });

      const j = await safeJson(res);
      if (!res.ok) throw new Error(j.error || j._raw || `HTTP ${res.status}`);
      setMsg(j.message || "ID uploaded");
      console.log("uploadId response:", j);
      await fetchStatus();
    } catch (err) {
      console.error("uploadId error:", err);
      setMsg("Upload failed. See console.");
    } finally {
      setLoadingAction("");
    }
  };

  const submitCreds = async () => {
    setMsg("");
    setLoadingAction("submitCreds");
    try {
      const res = await fetch(`${API_BASE}/api/verification/submit-credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, barNumber, jurisdiction, practiceAreas: [] }),
      });
      const j = await safeJson(res);
      if (!res.ok) throw new Error(j.error || j._raw || `HTTP ${res.status}`);
      setMsg(j.message || "Credentials submitted");
      console.log("submitCreds response:", j);
      await fetchStatus();
    } catch (err) {
      console.error("submitCreds error:", err);
      setMsg("Submit credentials failed. See console.");
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <div className="verify-container">
      <h2>Lawyer Verification</h2>

      <div className="verify-status">
        Status:
        <span className={`status-pill status-${status?.status || "incomplete"}`}>
          {status?.status || "incomplete"}
        </span>
      </div>

      <section className="verify-section">
        <h3>Phone verification</h3>
        <input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            className="verify-btn"
            onClick={requestOtp}
            disabled={loadingAction !== ""} 
          >
            {loadingAction === "requestOtp" ? "Sending…" : "Request OTP"}
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button
            type="button"
            className="verify-btn"
            style={{ marginLeft: 8 }}
            onClick={confirmOtp}
            disabled={loadingAction !== ""}
          >
            {loadingAction === "confirmOtp" ? "Verifying…" : "Confirm OTP"}
          </button>
        </div>
      </section>

      <section className="verify-section">
        <h3>ID document</h3>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            className="verify-btn"
            onClick={uploadId}
            disabled={loadingAction !== ""}
          >
            {loadingAction === "uploadId" ? "Uploading…" : "Upload ID"}
          </button>
        </div>
      </section>

      <section className="verify-section">
        <h3>Professional credentials</h3>
        <input
          placeholder="Bar number (use 'VALID...' to auto-verify in demo)"
          value={barNumber}
          onChange={(e) => setBarNumber(e.target.value)}
        />
        <input
          placeholder="Jurisdiction"
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value)}
          style={{ marginTop: 8 }}
        />
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            className="verify-btn"
            onClick={submitCreds}
            disabled={loadingAction !== ""}
          >
            {loadingAction === "submitCreds" ? "Submitting…" : "Submit Credentials"}
          </button>
        </div>
      </section>

      <div className="verify-message">{msg}</div>

      <div className="verify-json-box">
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </div>
    </div>
  );
}
