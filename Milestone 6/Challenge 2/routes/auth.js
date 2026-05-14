import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pg from 'pg';
import authenticate from '../middleware/authenticate.js';
import { toAuthUser, toProfileUser } from '../utils/response-mappers.js';

const router = express.Router();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user and return only safe fields
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, verification_token)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, hash, verificationToken]
    );

    const mappedUser = toAuthUser(result.rows[0]);
    res.status(201).json({ user: mappedUser });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    // Fetch user (but don't expose sensitive fields)
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // JWT contains only essential claims: userId and role for authorization
    const token = jwt.sign({
      userId: user.id,
      role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Response contains only safe user fields
    const mappedUser = toAuthUser(user);
    res.json({ token, user: mappedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET ME ROUTE
router.get('/me', authenticate, async (req, res) => {
  try {
    // Fetch user data
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.user.userId]
    );
    
    // Return only safe fields for profile
    const mappedUser = toProfileUser(result.rows[0]);
    res.json({ user: mappedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
