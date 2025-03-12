import React from "react";
import "../styles/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";


function UserDashboard() {
    const navigate = useNavigate();
  return (
    <div className="usermain">
        <div className="ubox1">
            <li onClick={() => navigate("/api/user")}>Home</li>
            <li onClick={() => navigate("/api/user/resign")}>Apply Resignation</li>
            <li onClick={() => navigate("/api/user/resign_status")}>Resignation Status</li>
            <li onClick={() => navigate("/api/user/logout")}>Logout</li>
        </div>
        <div className="dashboard-container"> 
            <Outlet/>
        </div>
    </div>
  );
}

export default UserDashboard;
