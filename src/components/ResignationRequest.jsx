import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ResignationRequests.css"; // Import CSS file

function ResignationRequest() {
    const [resignations, setResignations] = useState([]);
    const [searchCode, setSearchCode] = useState(""); // Search by Employee Code
    const [selectedLWD, setSelectedLWD] = useState({}); // Store LWD per employee

    useEffect(() => {
        fetchResignations();
    }, []);

    const fetchResignations = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/admin/resignations");
            setResignations(response.data);
        } catch (error) {
            console.error("Error fetching resignations:", error);
        }
    };

    // Function to update resignation status with LWD
    const updateResignationStatus = async (code, approved) => {
        try {
            if (approved) {
                const selectedDate = selectedLWD[code];
    
                if (!selectedDate) {
                    alert("Please select a Last Working Day before approving.");
                    return;
                }
    
                // Check if LWD is a weekend (Saturday = 6, Sunday = 0)
                const dayOfWeek = new Date(selectedDate).getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    alert("LWD cannot be on a weekend. Please select a valid working day.");
                    return;
                }
    
                // Check if LWD is a public holiday (fetching from backend)
                const { data } = await axios.get(`http://localhost:8080/api/admin/check_holiday?date=${selectedDate}`);
                if (data.isHoliday) {
                    alert("LWD cannot be on a public holiday. Please select a valid working day.");
                    return;
                }
            }
    
            const confirmAction = window.confirm(
                `Are you sure you want to ${approved ? "approve" : "reject"} this resignation?`
            );
            if (!confirmAction) return;
    
            const response = await axios.put("http://localhost:8080/api/admin/conclude_resignation", {
                code,
                approved,
                lwd: approved ? selectedLWD[code] : null,
            });
    
            alert(response.data.message); // Show message returned from backend
            fetchResignations();
        } catch (error) {
            console.error("Error updating resignation status:", error);
            alert(error.response?.data?.message || "An error occurred.");
        }
    };
    
    
    

    // Filter resignations based on Employee Code
    const filteredResignations = searchCode
        ? resignations.filter((resignation) =>
            resignation.code.toLowerCase().includes(searchCode.toLowerCase())
        )
        : resignations;

    return (
        <div className="resign-container">
            <h2>Resignation Requests</h2>

            {/* Search Input for Employee Code */}
            <div className="search-container">
                <label>Search by Employee Code:</label>
                <input
                    type="text"
                    placeholder="Enter Employee Code..."
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                />
                <button onClick={() => setSearchCode("")}>Clear</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Employee Code</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Resignation Date</th>
                        <th>Reason</th>
                        <th>Last Working Day</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredResignations.length > 0 ? (
                        filteredResignations.map((resignation) => (
                            <tr key={resignation.id}>
                                <td>{resignation.code}</td>
                                <td>{resignation.uname}</td>
                                <td>{resignation.email}</td>
                                <td>{new Date(resignation.date).toLocaleDateString()}</td>
                                <td>{resignation.reason}</td>
                                <td>
                                    {resignation.status === "Approved"
                                        ? new Date(resignation.lwd).toLocaleDateString()
                                        : (
                                            <input
                                                type="date"
                                                value={selectedLWD[resignation.code] || ""}
                                                onChange={(e) =>
                                                    setSelectedLWD({
                                                        ...selectedLWD,
                                                        [resignation.code]: e.target.value
                                                    })
                                                }
                                            />
                                        )
                                    }
                                </td>
                                <td className={resignation.status.toLowerCase()}>{resignation.status}</td>
                                <td>
                                    {resignation.status === "Pending" ? (
                                        <>
                                            <button className="approve" onClick={() => updateResignationStatus(resignation.code, true)}>
                                                Approve
                                            </button>
                                            <button className="reject" onClick={() => updateResignationStatus(resignation.code, false)}>
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <span>{resignation.status}</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No resignation requests found for this Employee Code.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ResignationRequest;
