import React, { useState } from "react";
import "../styles/Register.css";

function Register() {
  const [form, setForm] = useState({ username: "", password: "", role: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              type="text"
              required
              placeholder=" "
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
            <label>Username</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              required
              placeholder=" "
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <label>Password</label>
          </div>

          <div className="input-group">
            <select
              required
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="lawyer">Lawyer</option>
            </select>
            <label>Role</label>
          </div>

          <button className="btn-register" type="submit">
            Register
          </button>
        </form>

        <p className="message">{message}</p>
      </div>
    </div>
  );
}

export default Register;
