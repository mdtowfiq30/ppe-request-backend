const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Parse incoming JSON
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'ppe_requests'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to the database!');
});

// Handle PPE request submission
app.post('/submit-request', (req, res) => {
  const { name, employee_id, ppe, date_requested } = req.body;  // Ensure consistency here

  if (!name || !employee_id || !ppe || !date_requested) {
    console.error('Missing required fields:', { name, employee_id, ppe, date_requested });
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query = 'INSERT INTO requests (name, employee_id, ppe, date_requested) VALUES (?, ?, ?, ?)';
  db.query(query, [name, employee_id, ppe, date_requested], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json({ message: 'Request submitted successfully!' });
  });
});

// Retrieve all PPE requests
app.get('/get-requests', (req, res) => {
  const query = 'SELECT id, name, employee_id, ppe, DATE_FORMAT(date_requested, "%Y-%m-%d") AS date_requested FROM requests';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Failed to fetch requests' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
