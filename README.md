📌 README.md (HR Resignation Management System)
HR Resignation Management System
A full-stack MERN application to manage employee resignations, approvals, exit questionnaires, and HR functions securely.

🚀 Features
✔️ Employee Registration & Login (JWT Authentication)
✔️ Submit Resignation Requests
✔️ HR Dashboard to Approve/Reject Requests
✔️ Exit Questionnaire for Employees
✔️ Weather Information Based on Location
✔️ Role-Based Access Control (Employees & HR)

🛠 Technologies Used
Frontend: React.js, Axios, React Router
Backend: Node.js, Express.js, PostgreSQL, JWT
Database: PostgreSQL
Styling: CSS3, FontAwesome Icons
Authentication: JSON Web Tokens (JWT)
Mailing: Nodemailer
📥 Installation Guide
1️⃣ Clone the Repository

git clone https://github.com/your-username/hr-resignation-system.git
cd hr-resignation-system

2️⃣ Setup the Backend
(a) Install Backend Dependencies

cd server
npm install
(b) Create a .env File in the Server Directory
Create a .env file and add the following variables:


# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_DATABASE=HRMS
DB_PASSWORD=your_password
DB_PORT=5432

# JWT Secret Key
TOP_SECRET=MYTOPSECRET

# Email Credentials for Nodemailer
COMPANY_MAIL=yourcompanyhr@gmail.com
EMAIL_APP_PASSWORD=yourapppassword

# Weather API Key (OpenWeather)
REACT_APP_API_KEY=your_openweather_api_key

# Calendarific API Key (For Holidays)
CALENDAR_API_KEY=your_calendarific_api_key
(c) Start the Backend Server

npm start
or if using nodemon:

npm run dev
The backend will run on http://localhost:8080.

3️⃣ Setup the Frontend

(a) Install Frontend Dependencies

cd client
npm install

(b) Start the React App

npm start
The frontend will run on http://localhost:3000.

📦 Database Setup (PostgreSQL)


1️⃣ Create the Database
Run the following command in PostgreSQL:

CREATE DATABASE HRMS;

2️⃣ Create Required Tables

(a) Users Table (For Employee & HR)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    emp_code VARCHAR(10) UNIQUE NOT NULL,  -- Auto-generated EMPxxxx
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Hashed Password
    role VARCHAR(20) DEFAULT 'Employee', -- 'Employee' or 'HR'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


(b) Resignations Table (For Employee Resignation Requests)

CREATE TABLE resignations (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL REFERENCES users(emp_code) ON DELETE CASCADE,
    uname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending', -- Pending, Approved, Rejected
    lwd DATE -- Last Working Day (HR assigns this)
);


(c) Exit Questionnaire Table

CREATE TABLE exit_questionnaire (
    id SERIAL PRIMARY KEY,
    employee_code VARCHAR(10) NOT NULL REFERENCES users(emp_code) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    work_value VARCHAR(50) NOT NULL,
    feedback TEXT NOT NULL,
    environment TEXT NOT NULL,
    leadership VARCHAR(50) NOT NULL,
    salary VARCHAR(10) NOT NULL,
    recommendation VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
🔐 Role-Based Authentication
Employee Login: Employees can register/login with their emp_code & password.
HR Login: The HR only uses the predefined admin credentials (username: admin, password: admin).
JWT Authentication: Every request is protected using JWT tokens.


🛠 API Endpoints
🔹 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new employee
POST	/api/auth/login	Login using emp_code & password
POST	/api/auth/admin-login	HR login (predefined credentials)



🔹 Employee Resignation
Method	Endpoint	Description
POST	/api/user/resign	Employee submits a resignation request
GET	/api/user/resign_status/:code	Get resignation status by Employee Code


🔹 HR Resignation Management
Method	Endpoint	Description
GET	/api/admin/resignations	Fetch all resignation requests
PUT	/api/admin/conclude_resignation	Approve or reject a resignation request


🔹 Exit Questionnaire
Method	Endpoint	Description
POST	/api/user/responses	Employee submits exit questionnaire
GET	/api/user/exit_responses	Fetch all exit responses


🔹 HR & Employees Management
Method	Endpoint	Description
GET	/api/admin	Get resignation request statistics
GET	/api/user/emp_list	Fetch list of employees


🔹 Holiday & Weather APIs
Method	Endpoint	Description
GET	/api/admin/check_holiday	Check if a date is a public holiday
Weather API	OpenWeatherMap API	Fetch real-time weather data