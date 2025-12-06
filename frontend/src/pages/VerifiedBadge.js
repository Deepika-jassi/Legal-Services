// frontend/src/components/VerifiedBadge.js
import React from "react";
import "../styles/VerifiedBadge.css"; // optional - you can include the style in your global css

export default function VerifiedBadge({ status }) {
  if (status !== "verified") return null;
  return <span style={{ background: "#c9f7d4", color: "#046c26", padding: "4px 8px", borderRadius: 12, fontWeight:700, marginLeft: 8 }}>✔ Verified</span>;
}
