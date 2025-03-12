import React, { useState } from "react";
import "../styles/UserLogin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", formData);

      localStorage.setItem("token", response.data.token); // ✅ Store JWT Token
      localStorage.setItem("emp_code", response.data.emp_code); // ✅ Store Employee Code
      localStorage.setItem("full_name", response.data.full_name); // ✅ Store Full Name
      localStorage.setItem("role", response.data.role); // ✅ Store Role

      setMessage("✅ Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/api/user"); // ✅ Redirect to UserDashboard
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
          <h2>Welcomes You</h2>
          <p>
            Don't have an account? <span className="click" onClick={() => navigate("/api/auth/register")}>Click Here</span><br />
          </p>
        </div>

        {/* Right Section - Login Form */}
        <div className="admin-right">
          <h2 className="admin-logo">Login</h2>
          {message && <p className="message">{message}</p>}

          <form className="admin-form" onSubmit={handleSubmit}>
            <label>Employee Code:</label>
            <input type="text" name="username" placeholder="Enter Employee Code" value={formData.username} onChange={handleChange} required />

            <label>Password</label>
            <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} required />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
