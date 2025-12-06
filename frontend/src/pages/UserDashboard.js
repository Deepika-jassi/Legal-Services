import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css"; // create this

export default function UserDashboard(){
  const navigate = useNavigate();

  return (
    <div className="user-dashboard">
      <section className="hero">
        <div className="hero-left">
          <h1>Find trusted legal help</h1>
          <p>Browse services, request help, manage documents and appointments.</p>
          <div className="hero-actions">
            <button onClick={() => navigate("/listings")} className="btn-primary">Browse Listings</button>
            <button onClick={() => navigate("/kyc")} className="btn-ghost">Start KYC</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="card small">
            <h4>My Requests</h4>
            <p>No active requests</p>
            <button onClick={() => navigate("/service-request")} className="btn-small">Start Request</button>
          </div>

          <div className="card small">
            <h4>My Documents</h4>
            <p>Upload & manage files</p>
            <button onClick={() => navigate("/documents")} className="btn-small">Open</button>
          </div>
        </div>
      </section>

      <section className="quick-grid">
        <div className="card">
          <h3>Book Consultation</h3>
          <p>Quick 30-min consults with verified lawyers.</p>
          <button onClick={() => navigate("/listings")} className="btn-link">Book now</button>
        </div>

        <div className="card">
          <h3>Favorites</h3>
          <p>Saved lawyers & services.</p>
          <button onClick={() => alert("Favorites coming soon")} className="btn-link">Open</button>
        </div>

        <div className="card">
          <h3>Messages</h3>
          <p>Chat with your lawyers</p>
          <button onClick={() => navigate("/lawyer/messages")} className="btn-link">Open</button>
        </div>
      </section>
    </div>
  );
}
