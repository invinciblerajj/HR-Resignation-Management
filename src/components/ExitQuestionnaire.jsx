import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ExitQuestionnaire.css"; // Import CSS

function ExitQuestionnaire() {
    const [responses, setResponses] = useState({
        employee_code: "",  // Initially empty, will be set dynamically
        reason: "",
        workValue: "",
        feedback: "",
        environment: "",
        leadership: "",
        salary: "",
        recommendation: ""
    });

    // ✅ Get Employee Code from localStorage when component loads
    useEffect(() => {
        const empCode = localStorage.getItem("emp_code");  // Retrieve from storage
        if (empCode) {
            setResponses((prevData) => ({ ...prevData, employee_code: empCode }));
        }
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setResponses({ ...responses, [name]: value });
    };

    // Submit responses
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/user/responses", responses);
            alert("Exit questionnaire submitted successfully!");

            // Reset form but keep employee code
            setResponses({
                employee_code: responses.employee_code,  // ✅ Keep employee_code unchanged
                reason: "",
                workValue: "",
                feedback: "",
                environment: "",
                leadership: "",
                salary: "",
                recommendation: ""
            });
        } catch (error) {
            console.error("Error submitting responses:", error);
            alert("Failed to submit. Please try again.");
        }
    };

    return (
        <div className="exit-container">
            <h2>Exit Questionnaire</h2>
            <form onSubmit={handleSubmit}>
                {/* ✅ Employee Code (Auto-filled, Read-only) */}
                <label>Employee Code:</label>
                <input type="text" name="employee_code" value={responses.employee_code} className="emp-code" />

                <label>1. What is the primary reason for your resignation?</label>
                <input type="text" name="reason" value={responses.reason} onChange={handleChange} required />

                <label>2. Did you feel your work was valued by your team and management?</label>
                <select name="workValue" value={responses.workValue} onChange={handleChange} required>
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label>3. Did you receive enough feedback about your performance?</label>
                <select name="feedback" value={responses.feedback} onChange={handleChange} required>
                    <option value="">Select an option</option>
                    <option value="Always">Always</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Never">Never</option>
                </select>

                <label>4. How would you describe the work environment at the company?</label>
                <textarea name="environment" value={responses.environment} onChange={handleChange} required></textarea>

                <label>5. How would you rate your manager’s leadership style?</label>
                <select name="leadership" value={responses.leadership} onChange={handleChange} required>
                    <option value="">Select an option</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                </select>

                <label>6. Were you satisfied with your salary and benefits?</label>
                <select name="salary" value={responses.salary} onChange={handleChange} required>
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label>7. Would you recommend this company to others looking for a job?</label>
                <select name="recommendation" value={responses.recommendation} onChange={handleChange} required>
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ExitQuestionnaire;
