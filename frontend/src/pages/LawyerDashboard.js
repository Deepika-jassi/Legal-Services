// src/pages/LawyerDashboard.js
import React from "react";
import "../pages/LawyerDashboard.css";
import { useNavigate } from "react-router-dom";
import VerifiedBadge from "../pages/VerifiedBadge"; // <-- correct import path

function LawyerDashboard() {
  const navigate = useNavigate();

  // get current user (fake-auth) from localStorage (used earlier)
  // expected shape: { id: 'lawyer1', role: 'lawyer', verification: 'verified' }
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {
    user = {};
  }

  // decide status: if user contains verification field use it, else 'unverified'
  const status = user.verification || "unverified";

  return (
    <div className="lawyer-dashboard">
      <div className="lawyer-header">
        <h2>
          Welcome, Lawyer 👨‍⚖️
          <VerifiedBadge status={status} />
        </h2>
        <p>Manage your services, view appointments, and assist clients.</p>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <h3>My Appointments</h3>
          <p>See all scheduled client meetings.</p>
          <button onClick={() => navigate("/lawyer/appointments")}>View</button>
        </div>

        <div className="dash-card">
          <h3>My Services</h3>
          <p>Manage the legal services you provide.</p>
          <button onClick={() => navigate("/lawyer/services")}>Manage</button>
        </div>

        <div className="dash-card">
          <h3>Client Documents</h3>
          <p>Access documents uploaded by clients.</p>
          <button onClick={() => navigate("/lawyer/documents")}>Open</button>
        </div>

        <div className="dash-card">
          <h3>Messages</h3>
          <p>Chat with clients in real-time.</p>
          <button onClick={() => navigate("/lawyer/messages")}>Chat</button>
        </div>
      </div>
    </div>
  );
}

export default LawyerDashboard;
