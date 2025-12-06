import React, { useState } from "react";
import "../styles/Login.css";
import "./form.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message || "Login successful");

      const isLawyer = form.username.toLowerCase() === "lawyer";
      const user = {
        id: isLawyer ? "lawyer1" : "user1",
        role: isLawyer ? "lawyer" : "user",
      };
      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        navigate(isLawyer ? "/lawyer" : "/");
      }, 300);

    } catch (err) {
      console.error(err);
      setMessage("Login failed — check backend.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-center">

        {/* TOP HEADING CENTERED */}
        <h1 className="login-title">Login</h1>

        {/* CARD */}
        <div className="login-card">
          <div className="form-inner">
            <h2>Welcome Back</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <button type="submit">Login</button>
            </form>

            <p className="message">{message}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
