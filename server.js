import express from "express";
import axios from "axios";
import cors from "cors";
import pg from "pg";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
dotenv.config();

const CALENDARIFIC_API_KEY = process.env.CALENDAR_API_KEY; // ✅ API Key for Calendar API
const COUNTRY = "IN"; // ✅ Country for holiday check
const YEAR = new Date().getFullYear();
const SECRET_KEY = process.env.TOP_SECRET; // ✅ Secret key for JWT
const JWT_SECRET = process.env.TOP_SECRET;

// ✅ PostgreSQL Database Connection
const db = new pg.Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
db.connect();

// ✅ Nodemailer Configuration (HR Email)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.COMPANY_MAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});


// 1️⃣ **User Registration**
app.post("/api/auth/register", async (req, res) => {
    try {
        const { full_name, email, emp_code, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        await db.query(
            "INSERT INTO users (full_name, email, emp_code, password) VALUES ($1, $2, $3, $4)",
            [full_name, email, emp_code, hashedPassword]
        );

        // Generate JWT Token
        const token = jwt.sign(
            { emp_code, email, role: "Employee" },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(201).json({ message: "User registered successfully!", token });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Registration failed" });
    }
});

// 2️⃣ **User Login**
app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body; // Username = emp_code

    try {
        const userQuery = await db.query("SELECT * FROM users WHERE emp_code = $1", [username]);

        if (userQuery.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = userQuery.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { emp_code: user.emp_code, full_name: user.full_name, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            emp_code: user.emp_code,
            full_name: user.full_name,
            role: user.role
        });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 3️⃣ **Submit Resignation**
app.post("/api/user/resign", async (req, res) => {
    try {
        const { code, uname, email, date, reason } = req.body;

        await db.query(
            "INSERT INTO resignations (code, uname, email, date, reason, status) VALUES ($1, $2, $3, $4, $5, 'Pending')",
            [code, uname, email, date, reason]
        );

        res.status(200).json({ message: "Resignation request submitted successfully!" });
    } catch (err) {
        console.error("Error submitting resignation:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 4️⃣ **View All Resignations (Admin)**
app.get("/api/admin/resignations", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM resignations");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// 5️⃣ **Approve/Reject Resignation**
app.put("/api/admin/conclude_resignation", async (req, res) => {
    try {
        const { code, approved, lwd } = req.body;

        const status = approved ? "Approved" : "Rejected";
        await db.query(
            "UPDATE resignations SET status = $1, lwd = $2 WHERE code = $3",
            [status, approved ? lwd : null, code]
        );

        res.status(200).json({ message: `Resignation ${status} successfully!` });
    } catch (err) {
        console.error("Error updating resignation status:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 6️⃣ **Submit Exit Questionnaire**
app.post("/api/user/responses", async (req, res) => {
    try {
        const { employee_code, reason, workValue, feedback, environment, leadership, salary, recommendation } = req.body;

        await db.query(
            "INSERT INTO exit_questionnaire (employee_code, reason, work_value, feedback, environment, leadership, salary, recommendation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [employee_code, reason, workValue, feedback, environment, leadership, salary, recommendation]
        );

        res.status(200).json({ message: "Exit questionnaire submitted successfully!" });
    } catch (err) {
        console.error("Error saving exit questionnaire:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 7️⃣ **View All Exit Questionnaires (Admin)**
app.get("/api/admin/exit_responses", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM exit_questionnaire");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching exit responses:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 8️⃣ **Fetch Employee List (HR)**
app.get("/api/user/emp_list", async (req, res) => {
    try {
        const result = await db.query("SELECT emp_code, full_name, email, role FROM users");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// 9️⃣ **Dashboard Metrics (Resignation Counts)**
app.get("/api/admin", async (req, res) => {
    try {
        const resignr = await db.query("SELECT COUNT(code) FROM resignations");
        const resignapproved = await db.query("SELECT COUNT(code) FROM resignations WHERE status=$1", ["Approved"]);

        res.status(200).json({
            count: resignr.rows[0].count,
            approved: resignapproved.rows[0].count,
            pending: resignr.rows[0].count - resignapproved.rows[0].count
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

//  🔐 10️⃣ **Admin Login (HR) with Fixed Credentials**
app.post("/api/auth/admin-login", async (req, res) => {
    const { username, password } = req.body; // Admin Login Credentials

    // ✅ Set Fixed Admin Credentials
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // 🔴 Change this to a more secure password

    try {
        // ✅ Check if credentials match
        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { role: "Admin", username: ADMIN_USERNAME },
            JWT_SECRET,
            { expiresIn: "2h" } // Token expires in 2 hours
        );

        res.status(200).json({
            message: "Admin login successful",
            token,
            role: "Admin"
        });

    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
