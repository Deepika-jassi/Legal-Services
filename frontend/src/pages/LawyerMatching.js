import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LawyerMatching.css";

// Full lawyer dataset grouped by specialization
const lawyerDirectory = {
  "Contract Drafting": [
    { id: 1, name: "Alice Smith", specialization: "Contract Drafting" },
    { id: 4, name: "Michael Ray", specialization: "Business Contracts" }
  ],
  "Legal Consultation": [
    { id: 2, name: "Bob Johnson", specialization: "General Legal Consultation" }
  ],
  "Property Agreement Review": [
    { id: 5, name: "Priya Mehta", specialization: "Property Law" },
    { id: 6, name: "Ravi Kumar", specialization: "Real Estate Legal Review" }
  ],
  "Trademark Registration": [
    { id: 7, name: "Anita Kapoor", specialization: "Intellectual Property" },
    { id: 8, name: "George Patel", specialization: "Trademark Specialist" }
  ],
  "Startup Compliance": [
    { id: 9, name: "Sonia Iyer", specialization: "Startup Legalities" },
    { id: 10, name: "Karan Desai", specialization: "Company Registration & Compliance" }
  ],
  "Cyber Crime Assistance": [
    { id: 11, name: "Rajeev Sharma", specialization: "Cyber Law" },
    { id: 12, name: "Nisha Verma", specialization: "Online Harassment Cases" }
  ],
  "Family & Divorce Consultation": [
    { id: 13, name: "Carol Davis", specialization: "Family Law" },
    { id: 14, name: "Sneha Malhotra", specialization: "Divorce & Custody" }
  ],
  "Other": [
    { id: 15, name: "Generalist Lawyer", specialization: "Multi-field Legal Support" }
  ]
};

const LawyerMatching = ({ serviceCategory: propServiceCategory, onNext }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // prefer propServiceCategory (if App routed with props), else read from location.state
  const serviceCategory = propServiceCategory || (location.state && location.state.serviceCategory) || "Other";

  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [scheduledDate, setScheduledDate] = useState("");

  // pick lawyers by service (falls back to "Other")
  const availableLawyers = lawyerDirectory[serviceCategory] || lawyerDirectory["Other"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLawyer || !scheduledDate) {
      alert("Please select a lawyer and schedule date.");
      return;
    }

    // if parent passed an onNext prop, call it for the original flow
    if (typeof onNext === "function") {
      onNext({ selectedLawyer, scheduledDate });
    } else {
      // if no callback, you might want to put the selection into session/local storage
      // or navigate and pass it via location.state to the next route:
      navigate("/payment-compliance", { state: { selectedLawyer, scheduledDate, serviceCategory } });
      return;
    }

    // original flow (if onNext handled), continue navigation
    navigate("/payment-compliance");
  };

  return (
    <div className="lawyer-matching-container">
      <h2>Select Lawyer & Schedule</h2>
      <p>Service: {serviceCategory}</p>

      <form onSubmit={handleSubmit} className="lawyer-matching-form">
        <label>
          Lawyer:
          <select
            value={selectedLawyer?.id || ""}
            onChange={(e) =>
              setSelectedLawyer(
                availableLawyers.find(l => l.id === parseInt(e.target.value))
              )
            }
          >
            <option value="">-- Select lawyer --</option>

            {availableLawyers.map((lawyer) => (
              <option key={lawyer.id} value={lawyer.id}>
                {lawyer.name} ({lawyer.specialization})
              </option>
            ))}
          </select>
        </label>

        <label>
          Schedule Date & Time:
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </label>

        <button type="submit" className="submit-btn">Next</button>
      </form>
    </div>
  );
};

export default LawyerMatching;
