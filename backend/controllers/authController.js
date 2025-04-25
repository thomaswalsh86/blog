const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../db');

const JWT_SECRET = process.env.SUPA;

const createUser = async (req, res) => {
  const { username, password, email, address } = req.body;

  // Validation
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, password and email are required' });
  }

  let db;
  try {
    db = await connectDB();
    
    // Check existing user
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ?', 
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await db.execute(
      'INSERT INTO users (username, password, email, address) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, address]
    );

    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      username,
      email
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  } finally {
    if (db) await db.end();
  }
};

// Login
const checkAuth = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectDB();
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [email]);

    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, email });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createUser, checkAuth };
