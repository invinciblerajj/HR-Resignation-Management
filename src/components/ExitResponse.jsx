import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ExitResponse.css"; // Import CSS file

function ExitResponse() {
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get("http://localhost:8080/api/user/exit_responses");
            setResponses(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return (
        <div className="exit-response-container">
            <h2>Exit Questionnaire Responses</h2>

            {responses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Employee Code</th>
                            <th>Reason</th>
                            <th>Work Valued</th>
                            <th>Feedback</th>
                            <th>Work Environment</th>
                            <th>Leadership</th>
                            <th>Salary Satisfaction</th>
                            <th>Recommendation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map((res, index) => (
                            <tr key={index}>
                                <td>{res.employee_code}</td>
                                <td>{res.reason}</td>
                                <td>{res.work_value}</td>
                                <td>{res.feedback}</td>
                                <td>{res.environment}</td>
                                <td>{res.leadership}</td>
                                <td>{res.salary}</td>
                                <td>{res.recommendation}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No exit responses available.</p>
            )}
        </div>
    );
}

export default ExitResponse;
