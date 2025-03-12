import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="main">
      {/* Admin Login Card */}
      <div className="box">
        <img src="/images/staff.png" alt="Admin Icon" />
        <h2>HR Login</h2>
        <p>Login using your Employee Code and Password to access your account, keep track of your progress, and other official services.</p>
        <button onClick={() => navigate('/api/auth/admin-login')}>Admin Login</button>
      </div>

      {/* User Login Card */}
      <div className="box">
        <img src="/images/user.png" alt="User Icon" />
        <h2>Employee Login</h2>
        <p>Login with your Username and Password to access your Services and Account. Keep a record of your progress and stay updated.</p>
        <button onClick={() => navigate('/api/auth/login')}>User Login</button>
      </div>
    </div>
  );
}

export default Login;
