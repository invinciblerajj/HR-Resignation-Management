import React from "react";
import "../styles/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";


function UserDashboard() {
    const navigate = useNavigate();
  return (
    <div className="usermain">
        <div className="ubox1">
            <li onClick={() => navigate("/api/admin/home")}>Home</li>
            <li onClick={() => navigate("/api/admin/resignations")}>Regisnation Requests</li>
            <li onClick={() => navigate("/api/admin/exit_responses")}>Questionnaire Responded</li>
            <li onClick={()=>navigate('/api/admin/employees')}>Employees List</li>
            <li onClick={() => navigate("/api/admin/logout")}>Logout</li>
        </div>
        <div className="dashboard-container"> 
            <Outlet/>
        </div>
    </div>
  );
}

export default UserDashboard;
