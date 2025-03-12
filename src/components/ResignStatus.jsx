import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Import jwtDecode
import "../styles/ResignStatus.css"; // Import CSS

function ResignStatus() {
    const [resignation, setResignation] = useState(null);
    const navigate = useNavigate();
    const [employeeCode, setEmployeeCode] = useState(""); // ✅ Store Employee Code

    // Extract Employee Code from JWT Token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setEmployeeCode(decoded.emp_code); // ✅ Extract emp_code from token
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    // Fetch Resignation Status
    useEffect(() => {
        if (employeeCode) {
            fetchResignationStatus();
        }
    }, [employeeCode]); // ✅ Fetch only after employeeCode is set

    const fetchResignationStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/resign_status/${employeeCode}`);
            setResignation(response.data);
        } catch (error) {
            console.error("Error fetching resignation status:", error);
        }
    };

    return (
        <div className="resign-status-container">
            <h2>Resignation Status</h2>

            {resignation ? (
                <div className="status-card">
                    <p>
                        <strong>Application Status:</strong>{" "}
                        <span className={resignation.status.toLowerCase()}>{resignation.status}</span>
                    </p>

                    {resignation.status === "Approved" && (
                        <p>
                            <strong>Last Working Day:</strong> {new Date(resignation.lwd).toLocaleDateString()}
                        </p>
                    )}

                    {resignation.status === "Approved" && (
                        <button className="feedback-button" onClick={() => navigate("/api/user/responses")}>
                            Fill Exit Feedback
                        </button>
                    )}
                </div>
            ) : (
                <p>Loading resignation status...</p>
            )}
        </div>
    );
}

export default ResignStatus;
