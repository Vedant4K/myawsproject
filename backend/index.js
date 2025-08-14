const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());


// Use your NeonDB connection string here
const connectionString = 'postgresql://neondb_owner:npg_lxdKF7TZ8NQu@ep-small-bonus-aeppwvsk-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString,
});

app.get('/', (req, res) => {
  res.send('NeonDB Node.js API');
});

// Example table: users(id SERIAL PRIMARY KEY, name TEXT, email TEXT)
// Create the table in NeonDB before testing

app.post('/users', async (req, res) => {
  const { name, email, password, gender, subscribe, comment } = req.body;
  
  // Basic validation
  if (!name || !email || !password || !gender) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const result = await pool.query(
      `INSERT INTO users 
       (name, email, password, gender, subscribe, comment)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email, password, gender, subscribe ?? false, comment ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);  // return all users as JSON array
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Database error' });
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
