import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/api/auth/login" replace />; // Redirect to login if no token
  }

  try {
    const decoded = jwtDecode(token);
    
    // Ensure user is an Employee, otherwise redirect
    if (decoded.role === "Employee") {
      return <Outlet />;
    } else {
      return <Navigate to="/api/admin/home" replace />;
    }
  } catch (error) {
    return <Navigate to="/api/auth/login" replace />;
  }
};

export default ProtectedRoute;
