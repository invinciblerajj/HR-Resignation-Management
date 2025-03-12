import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AdminRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/api/auth/admin-login" replace />; // Redirect if no token
  }

  try {
    const decoded = jwtDecode(token);

    // Ensure user is an Admin, otherwise redirect
    if (decoded.role === "Admin") {
      return <Outlet />;
    } else {
      return <Navigate to="/api/user/home" replace />;
    }
  } catch (error) {
    return <Navigate to="/api/auth/admin-login" replace />;
  }
};

export default AdminRoute;
