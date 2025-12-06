import React from "react";

const Report = ({ reportData }) => {
  if (!reportData) {
    return <p>No report available. Please complete the service process first.</p>;
  }

  const {
    clientName,
    serviceCategory,
    lawyerName,
    scheduledDate,
    status,
    notes,
  } = reportData;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "2rem", fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <h2>Service Report</h2>
      <p><strong>Client:</strong> {clientName}</p>
      <p><strong>Service:</strong> {serviceCategory}</p>
      <p><strong>Lawyer:</strong> {lawyerName}</p>
      <p><strong>Scheduled Date:</strong> {scheduledDate}</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Notes:</strong> {notes}</p>
      <button
        onClick={() => alert("Download Report feature coming soon!")}
        style={{
          marginTop: "1.5rem",
          padding: "0.8rem 1.5rem",
          fontWeight: "bold",
          backgroundColor: "#4a90e2",
          color: "white",
          border: "none",
          borderRadius: "30px",
          cursor: "pointer"
        }}
      >
        Download Report (PDF)
      </button>
    </div>
  );
};

export default Report;
