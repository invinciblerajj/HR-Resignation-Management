import React, { useState } from 'react';
import axios from 'axios';
import "../styles/SubmitResignation.css";

function SubmitResignation() {
  const [successPopup, setSuccessPopup] = useState(false);
  const [Data, setData] = useState({
    code: "",
    uname: "",
    email: "",
    date: "",
    reason: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/user/resign", Data);
      
      console.log("Response from backend:", response.data);

      if (response.status === 200) {
        setSuccessPopup(true);
        setData({
          code: "",
          uname: "",
          email: "",
          date: "",
          reason: ""
        });
      }
    } catch (err) {
      console.error("Error submitting resignation:", err);
      alert("Failed to submit resignation. Please try again.");
    }
  };

  return (
    <div className='submit'>
      <h2>Submit Resignation</h2>
      <div className='submit-box'>
        <label>Employee Code</label>
        <input type="text" placeholder="Enter Employee Code" name='code' value={Data.code} onChange={handleChange} required/>

        <label>Full Name</label>
        <input type="text" placeholder="Enter Full Name" name='uname' value={Data.uname} onChange={handleChange} required/>

        <label>Email</label>
        <input type="email" placeholder="Enter Email" name='email' value={Data.email} onChange={handleChange} required/>

        <label>Resignation Date</label>
        <input type="date" name='date' value={Data.date} onChange={handleChange} required/>

        <label>Reason for Resignation</label>
        <textarea placeholder="Explain your reason..." rows="4" name='reason' value={Data.reason} onChange={handleChange} required></textarea>

        <button onClick={handleClick}>Submit</button>

        {successPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>Resignation submitted successfully!</p>
              <button onClick={() => setSuccessPopup(false)}>OK</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SubmitResignation;
