import React, { useState, useEffect } from "react";
import "../styles/UserHome.css";
import axios from "axios";

function UserHome() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [resignRequest, setResignRequest] = useState('');
    const [pendingRequest, setPendingRequest] = useState('');
    const [respondedRequest, setRespondedRequest] = useState('');
    const [weather, setWeather] = useState({ temp: null, city: "Fetching...", humidity: null });
  
    const API_KEY = process.env.REACT_APP_API_KEY; 

    useEffect(() => {
        fetchData();
        fetchWeather(); 

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
    
        return () => clearInterval(timer);
    }, []);

    // ✅ Fetch Admin Data
    async function fetchData(){
        try {
            const RR = await axios.get("http://localhost:8080/api/admin");
            setResignRequest(RR.data.count);
            setRespondedRequest(RR.data.approved);
            setPendingRequest(RR.data.pending);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // ✅ Fetch Weather Data
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
                <h2>Welcome, Admin!</h2>

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
                        <p>Resignation Requests</p>
                        <h3>{resignRequest}</h3>
                    </div>
                    <div className="stat-card">
                        <p>Rejected Requests</p>
                        <h3>{pendingRequest}</h3>
                    </div>
                    <div className="stat-card">
                        <p>Request Responded</p>
                        <h3>{respondedRequest}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserHome;
