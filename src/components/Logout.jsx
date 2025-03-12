import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Logout.css"; // Import CSS file

function Logout() {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        // Clear authentication data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("employee_code");

        // Redirect after 2 seconds
        setTimeout(() => {
            setShowPopup(false);
            navigate("/");
        }, 2000);
    }, [navigate]);

    return (
        <div className="logout-overlay">
            {showPopup && (
                <div className="logout-popup">
                    <h2>Logging Out...</h2>
                    <p>You will be redirected shortly.</p>
                    <div className="spinner"></div>
                </div>
            )}
        </div>
    );
}

export default Logout;
