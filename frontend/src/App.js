// src/App.js
import React, { useState } from "react";
import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import Register from "./pages/Register";
import KycVerification from "./pages/KycVerification";
import ServiceRequest from "./pages/ServiceRequest";
import LawyerMatching from "./pages/LawyerMatching";
import CompliancePayment from "./pages/CompliancePayment";
import Report from "./pages/Report";
import LawyerDashboard from "./pages/LawyerDashboard";
import LawyerVerify from "./pages/LawyerVerify";
import VerifyAdmin from "./pages/VerifyAdmin";
import UserDashboard from "./pages/UserDashboard";

// ✅ NEW IMPORTS
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import ClientDocs from "./pages/ClientDocs";
import Messages from "./pages/Messages";

function App() {
  const [kycData, setKycData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [lawyerSelectionData, setLawyerSelectionData] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const reportData = paymentCompleted
    ? {
        clientName: kycData?.fullname,
        serviceCategory: serviceData?.serviceCategory,
        lawyerName: lawyerSelectionData?.selectedLawyer?.name,
        scheduledDate: lawyerSelectionData?.scheduledDate,
        status: "Service Completed",
        notes: "Thank you for using our legal services.",
      }
    : null;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/kyc" element={<KycVerification onNext={setKycData} />} />
        <Route
          path="/service-request"
          element={<ServiceRequest kycData={kycData} onNext={setServiceData} />}
        />
        <Route
          path="/lawyer-matching"
          element={
            <LawyerMatching
              serviceCategory={serviceData?.serviceCategory}
              onNext={setLawyerSelectionData}
            />
          }
        />
        <Route
          path="/payment-compliance"
          element={
            <CompliancePayment
              lawyerSelectionData={lawyerSelectionData}
              onNext={() => setPaymentCompleted(true)}
            />
          }
        />
        <Route path="/report" element={<Report reportData={reportData} />} />

        {/* ============================= */}
        {/*        USER ROUTE            */}
        {/* ============================= */}
        <Route path="/user" element={<UserDashboard />} />

        {/* ============================= */}
        {/*        LAWYER ROUTES         */}
        {/* ============================= */}
        <Route path="/lawyer" element={<LawyerDashboard />} />
        <Route path="/lawyer/services" element={<Services />} />
        <Route path="/lawyer/appointments" element={<Appointments />} />
        <Route path="/lawyer/documents" element={<ClientDocs />} />
        <Route path="/lawyer/messages" element={<Messages />} />
        <Route path="/lawyer/verify" element={<LawyerVerify />} />
        <Route path="/admin/verifications" element={<VerifyAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
