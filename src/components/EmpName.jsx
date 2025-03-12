import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ExitResponse.css"; // Import CSS file

function EmpName() {
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get("http://localhost:8080/api/user/emp_list");
            setResponses(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return (
        <div className="exit-response-container">
            <h2>Employees List</h2>

            {responses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Employee Code</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map((res, index) => (
                            <tr key={index}>
                                <td>{res.emp_code}</td>
                                <td>{res.full_name}</td>
                                <td>{res.email}</td>
                                <td>{res.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No Employees.</p>
            )}
        </div>
    );
}

export default EmpName;
