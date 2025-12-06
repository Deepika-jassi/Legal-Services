// src/pages/ServiceRequest.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServiceRequest.css";

// services that can be auto-approved (immediate flow)
const autoApproveServices = [
  "Contract Drafting",
  "Legal Consultation"
];

// all services shown in the dropdown
const ALL_SERVICES = [
  "Contract Drafting",
  "Legal Consultation",
  "Property Agreement Review",
  "Trademark Registration",
  "Startup Compliance",
  "Cyber Crime Assistance",
  "Family & Divorce Consultation",
  "Other"
];

const ServiceRequest = ({ kycData, onNext }) => {
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Send appointment request to backend (always called)
  const sendAppointmentToBackend = async (serviceCategory, manualReview = false) => {
    try {
      const payload = {
        client: kycData?.fullname || "Unknown User",
        service: serviceCategory,
        datetime: new Date().toISOString(),
        lawyerId: "lawyer1", // default assigned lawyer - you can improve assignment later
        manualReview // boolean flag for admin/lawyer to see
      };

      const res = await fetch("http://localhost:5000/api/lawyer/create-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "user",
          "x-user-id": "user1"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        console.warn("create-appointment failed:", res.status, txt);
        return { ok: false, error: txt };
      }

      const data = await res.json();
      return { ok: true, data };
    } catch (err) {
      console.error("Failed to send appointment:", err);
      return { ok: false, error: String(err) };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!service) {
      setMessage("Please select a service category");
      return;
    }

    const isAuto = autoApproveServices.includes(service);

    // Always create appointment, but mark manualReview if not auto-approved
    const result = await sendAppointmentToBackend(service, !isAuto);

    if (!result.ok) {
      setMessage("Could not submit request — please try again.");
      return;
    }

    if (!isAuto) {
      // show friendly message for manual-review categories and still navigate
      setMessage("This category requires manual review. Your request has been submitted and will be reviewed shortly.");
      // still call onNext so upstream state is set
      onNext({ kycData, serviceCategory: service });
      // optionally navigate to a 'request submitted' page — for now reuse matching flow
      navigate("/lawyer-matching");
      return;
    }

    // Auto-approved path (existing behaviour)
    onNext({ kycData, serviceCategory: service });
    navigate("/lawyer-matching");
  };

  return (
    <div className="service-wrapper">
      <div className="service-card">
        <h2>Submit Service Request</h2>

        {kycData && (
          <p className="client-info">
            Client: <b>{kycData.fullname}</b>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Service Category:</label>
          <select value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">-- Select a service --</option>
            {ALL_SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button type="submit" className="submit-btn">
            Submit Request
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ServiceRequest;
