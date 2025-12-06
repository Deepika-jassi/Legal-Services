import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CompliancePayment.css";

const CompliancePayment = ({ lawyerSelectionData, onNext }) => {
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [complianceChecked, setComplianceChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!complianceChecked) {
      setErrorMessage("You must verify compliance.");
      return;
    }
    if (!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv) {
      setErrorMessage("Please fill all payment fields.");
      return;
    }

    setErrorMessage("");
    onNext();
    navigate("/report");
  };

  return (
    <div className="compliance-payment-container">
      <h2>Verify Compliance & Debit card Payment</h2>
      {lawyerSelectionData && (
        <p>
          <strong>Selected Lawyer:</strong> {lawyerSelectionData.selectedLawyer.name}
          <br />
          <strong>Scheduled Date:</strong> {lawyerSelectionData.scheduledDate}
        </p>
      )}
      <form onSubmit={handleSubmit} className="compliance-payment-form">
        <label>
          <input
            type="checkbox"
            checked={complianceChecked}
            onChange={() => setComplianceChecked(!complianceChecked)}
          />
          I confirm compliance with all legal requirements.
        </label>
        <label>
          Card Number:
          <input
            type="text"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
          />
        </label>
        <label>
          Expiry Date:
          <input
            type="text"
            name="expiry"
            value={paymentInfo.expiry}
            onChange={handleChange}
            placeholder="MM/YY"
          />
        </label>
        <label>
          CVV:
          <input
            type="password"
            name="cvv"
            value={paymentInfo.cvv}
            onChange={handleChange}
            placeholder="123"
          />
        </label>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" className="submit-btn">Submit Payment</button>
      </form>
    </div>
  );
};

export default CompliancePayment;
