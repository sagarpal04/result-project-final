const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "student_portal",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database.");
});

app.post("/login", (req, res) => {
  const { name, enrollment, dob } = req.body;
  if (!name || !enrollment || !dob) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = `SELECT * FROM students WHERE name = ? AND enrollment_number = ? AND date_of_birth = ?`;

  db.execute(query, [name, enrollment, dob], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length > 0) {
      res.json({ message: "Login successful." });
    } else {
      res.status(401).json({ message: "Invalid credentials." });
    }
  });
});

app.get("/studentinfo/:enrollment", (req, res) => {
  const { enrollment } = req.params;

  if (!enrollment) {
    return res.status(400).json({ message: "Enrollment number is required." });
  }

  const query = "SELECT * FROM students WHERE enrollment_number = ?";

  db.execute(query, [enrollment], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "Student not found." });
    }
  });
});

app.get("/resultinfo/:enrollment", (req, res) => {
  const { enrollment } = req.params;

  if (!enrollment) {
    return res.status(400).json({ message: "Enrollment number is required." });
  }

  const query = "SELECT * FROM subjects WHERE enrollment_number = ?";

  db.execute(query, [enrollment], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ message: "Student not found." });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// CREATE TABLE students (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(100) NOT NULL,
//   enrollment_number VARCHAR(50) NOT NULL UNIQUE,
//   date_of_birth DATE NOT NULL
// );
// CREATE TABLE subjects (
//   enrollment_number VARCHAR(50),
//   subject VARCHAR(255),
//   marks INT,
//   status VARCHAR(50)
// );
