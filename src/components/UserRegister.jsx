import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ✅ Import useNavigate
import "../styles/UserRegister.css";

function UserRegister() {
  const navigate = useNavigate(); // ✅ Initialize navigate function

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    empCode: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  // Generate Employee Code on component mount
  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, empCode: generateEmployeeCode() }));
  }, []);

  const generateEmployeeCode = () => {
    return `EMP${Math.floor(10000 + Math.random() * 9000)}`; // Generates EMPxxxx
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        full_name: formData.fullName,
        email: formData.email,
        emp_code: formData.empCode,
        password: formData.password,
      });

      localStorage.setItem("token", response.data.token); // ✅ Store JWT token

      setMessage("✅ Registration successful! Redirecting...");

      // ✅ Redirect user to UserDashboard after successful registration
      setTimeout(() => {
        navigate("/api/user"); // Redirect to UserDashboard
      }, 2000);  // Delay for 2 seconds to show success message

    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("❌ Registration failed. Try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-left">
          <h2>Join Us Today!</h2>
          <p>
            Already have an account? <a href="/api/auth/login">Login Here</a>
          </p>
        </div>

        <div className="register-right">
          <h2 className="register-logo">Register</h2>
          {message && <p className="message">{message}</p>}

          <form className="register-form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input type="text" name="fullName" placeholder="Enter Full Name" value={formData.fullName} onChange={handleChange} required />

            <label>Email</label>
            <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} required />

            <label>Employee Code</label>
            <input type="text" name="empCode" value={formData.empCode} readOnly className="emp-code" />

            <label>Password</label>
            <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} required />

            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;
