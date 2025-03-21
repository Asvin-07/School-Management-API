// Load environment variables
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Database Connection (Using Connection Pool)
const db = mysql.createPool({
    connectionLimit: 10, // Allows multiple connections
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    queueLimit: 0
});

// Default Route
app.get("/", (req, res) => {
    res.send("✅ School Management API is running!");
});

// Add School API (Using Connection Pool)
app.post("/addSchool", (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

    db.getConnection((err, connection) => {
        if (err) {
            console.error("Database connection failed:", err);
            return res.status(500).json({ error: "Database connection error" });
        }

        connection.query(query, [name, address, latitude, longitude], (err, result) => {
            connection.release(); // ✅ Always release the connection back to the pool

            if (err) {
                console.error("Query error:", err);
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
        });
    });
});

// Function to calculate distance (Haversine Formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = angle => (angle * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
};

// List Schools API (Using Connection Pool)
app.get("/listSchools", (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    db.getConnection((err, connection) => {
        if (err) {
            console.error("Database connection failed:", err);
            return res.status(500).json({ error: "Database connection error" });
        }

        connection.query("SELECT * FROM schools", (err, results) => {
            connection.release(); // ✅ Always release the connection back to the pool

            if (err) {
                console.error("Query error:", err);
                return res.status(500).json({ error: err.message });
            }

            const schoolsWithDistance = results.map(school => ({
                ...school,
                distance: calculateDistance(latitude, longitude, school.latitude, school.longitude)
            })).sort((a, b) => a.distance - b.distance);

            res.json(schoolsWithDistance);
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});