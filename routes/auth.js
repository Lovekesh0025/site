const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const pool = require('../config/database');
const router = express.Router();

// Demo admin account (for development)
const DEMO_ADMIN_EMAIL = 'admin@cutegoods.com';
const DEMO_ADMIN_PASSWORD = 'admin123';

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', { demoEmail: DEMO_ADMIN_EMAIL });
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

// Local Login POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check demo admin account
    if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (user.rows.length === 0) {
        const hashPassword = await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10);
        user = await pool.query(
          'INSERT INTO users (email, password, is_admin) VALUES ($1, $2, true) RETURNING *',
          [email, hashPassword]
        );
      }
      
      const userData = user.rows[0];
      req.session.userId = userData.id;
      req.session.isAdmin = userData.is_admin;
      
      return res.redirect(userData.is_admin ? '/admin/dashboard' : '/');
    }

    // Regular user login
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('auth/login', { error: 'Invalid email or password', demoEmail: DEMO_ADMIN_EMAIL });
    }

    req.session.userId = user.id;
    req.session.isAdmin = user.is_admin;

    if (user.is_admin) {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.render('auth/login', { error: 'Login failed', demoEmail: DEMO_ADMIN_EMAIL });
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/auth/login'
}), (req, res) => {
  req.session.userId = req.user.id;
  req.session.isAdmin = req.user.is_admin;
  res.redirect(req.user.is_admin ? '/admin/dashboard' : '/');
});

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/auth/login'
}), (req, res) => {
  req.session.userId = req.user.id;
  req.session.isAdmin = req.user.is_admin;
  res.redirect(req.user.is_admin ? '/admin/dashboard' : '/');
});

// Apple OAuth
router.get('/apple', passport.authenticate('apple'));

router.get('/apple/callback', passport.authenticate('apple', {
  failureRedirect: '/auth/login'
}), (req, res) => {
  req.session.userId = req.user.id;
  req.session.isAdmin = req.user.is_admin;
  res.redirect(req.user.is_admin ? '/admin/dashboard' : '/');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
