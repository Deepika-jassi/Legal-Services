import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./KycVerification.css";

const KycVerification = ({ onNext }) => {
  const [form, setForm] = useState({ fullname: "", email: "", phone: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullname || !form.email || !form.phone) {
      alert("Please fill all fields");
      return;
    }
    onNext(form);
    navigate("/service-request");
  };

  return (
    <div className="kyc-container">
      <h2>Verify KYC & Credentials</h2>
      <form onSubmit={handleSubmit} className="kyc-form">
        <label>
          Full Name:
          <input name="fullname" value={form.fullname} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Phone:
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <button type="submit" className="next-btn">Next</button>
      </form>
    </div>
  );
};

export default KycVerification;
