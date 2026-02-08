const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Register POST
router.post('/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render('auth/register', { error: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
    res.redirect('/auth/login');
  } catch (err) {
    res.render('auth/register', { error: 'Email already exists' });
  }
});

// Login POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    req.session.userId = user.id;
    req.session.isAdmin = user.is_admin;

    if (user.is_admin) {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.render('auth/login', { error: 'Login failed' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
