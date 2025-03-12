import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Login Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/auth/admin-login", formData);

      // ✅ Store JWT Token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      setMessage("✅ Admin login successful! Redirecting...");

      // ✅ Redirect to HR Dashboard after 2 seconds
      setTimeout(() => {
        navigate("/api/admin");
      }, 2000);

    } catch (error) {
      setMessage("❌ Invalid credentials. Try again.");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-box">
        {/* Left Section */}
        <div className="admin-left">
          <h2>Welcome HR</h2>
          <p>Only authorized personnel can log in.</p>
        </div>

        {/* Right Section - Login Form */}
        <div className="admin-right">
          <h2 className="admin-logo">HR Login</h2>
          {message && <p className="message">{message}</p>}

          <form className="admin-form" onSubmit={handleSubmit}>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Admin Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
