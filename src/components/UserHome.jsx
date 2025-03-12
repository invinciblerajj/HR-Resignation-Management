import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import "../styles/UserHome.css";
import axios from "axios";


const API_KEY = process.env.REACT_APP_API_KEY;

function UserHome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [empCode, setEmpCode] = useState(""); // Store Employee Code
  const [weather, setWeather] = useState({ temp: null, city: "Fetching...", humidity: null });

  
  // Decode JWT Token to Get Employee Code
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        setEmpCode(decoded.emp_code); // Extract employee code
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Update Time Every Second
  useEffect(() => {
    fetchWeather(); 
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchWeather = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                );
                
                setWeather({
                    temp: response.data.main.temp,
                    city: response.data.name,
                    humidity: response.data.main.humidity
                });
            } catch (error) {
                console.error("Error fetching weather:", error);
            }
        }, (error) => {
            console.error("Error getting location:", error);
        });
    } else {
        console.error("Geolocation not supported");
    }
};

  return (
    <div>
      <div className="ubox2">
        <h2>Welcome, {empCode || "Employee"}!</h2> {/* ✅ Dynamic Employee Code */}

        <div className="con">
                    {/* Date & Time */}
                    <div className="date-box">
                        <i className="fa-solid fa-calendar-days"></i>
                        <div className="date">
                        <p>{currentTime.toLocaleDateString()}</p>
                        <p>{currentTime.toLocaleTimeString()}</p>
                        </div>
                    </div>

                    {/* Weather */}
                    <div className="weather-box">
                        <div className="weather">
                        <h3>{weather.city}</h3>
                        <div className="weather-details">
                            <div className="weather-item">
                            <i className="fa-solid fa-temperature-high"></i>
                            <p>{weather.temp !== null ? `${weather.temp}°C` : "Loading..."}</p>
                            </div>
                            <div className="weather-item">
                            <i className="fa-solid fa-droplet"></i>
                            <p>{weather.humidity !== null ? `${weather.humidity}%` : "Loading..."}</p>
                            </div>
                        </div>
                        </div>
                    </div>
        </div>

        {/* Quick Stats */}
        <div className="stats">
          <div className="stat-card">
            <p>Upcoming Meetings</p>
            <h3>3</h3>
          </div>
          <div className="stat-card">
            <p>Pending Tasks</p>
            <h3>5</h3>
          </div>
          <div className="stat-card">
            <p>Leaves Remaining</p>
            <h3>10</h3>
          </div>
        </div>

        {/* Announcements */}
        <div className="announcements">
          <h3>Company Announcements</h3>
          <ul>
            <li>Annual Team Meetup scheduled for April 10th.</li>
            <li>Performance review cycle starts next week.</li>
            <li>Work-from-home policy updated, check the HR portal.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
