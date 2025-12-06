import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  // Get logged-in user (fake login stores this)
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Legal Marketplace</div>

      <ul className="navbar-links">
        
        {/* Common links for everyone */}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/listings">Listings</Link></li>
        <li><Link to="/documents">Documents</Link></li>

        {/* -------------------------
             IF USER IS LOGGED IN 
           ------------------------- */}
        {user ? (
          <>
            {/* If the user is a lawyer */}
            {user.role === "lawyer" && (
              <>
                <li><Link to="/lawyer">Dashboard</Link></li>
                <li><Link to="/lawyer/verify">Verify</Link></li>
              </>
            )}

            {/* If the user is a normal customer */}
            {user.role === "user" && (
              <li>
                <Link to="/kyc" className="kyc-link">
                  Start Service Request
                </Link>
              </li>
            )}

            {/* Logout */}
            <li>
              <button 
                onClick={handleLogout} 
                className="logout-btn"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          /* -------------------------
               IF NO USER IS LOGGED IN 
             ------------------------- */
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li>
              <Link to="/kyc" className="kyc-link">
                Start Service Request
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
