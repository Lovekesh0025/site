const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('./database');

module.exports = function(passport) {
  // Local Strategy (Email/Password)
  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return done(null, false, { message: 'User not found' });
      }
      
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      
      if (match) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (err) {
      return done(err);
    }
  }));

  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID) {
    passport.use('google', new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (user.rows.length === 0) {
          // Create new user
          const hashPassword = await bcrypt.hash('oauth-' + profile.id, 10);
          user = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, hashPassword]
          );
        }
        
        return done(null, user.rows[0]);
      } catch (err) {
        return done(err);
      }
    }));
  }

  // Facebook Strategy
  if (process.env.FACEBOOK_APP_ID) {
    passport.use('facebook', new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/auth/facebook/callback',
      profileFields: ['id', 'emails', 'displayName']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (user.rows.length === 0) {
          const hashPassword = await bcrypt.hash('oauth-' + profile.id, 10);
          user = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, hashPassword]
          );
        }
        
        return done(null, user.rows[0]);
      } catch (err) {
        return done(err);
      }
    }));
  }

  // Apple Strategy
  if (process.env.APPLE_TEAM_ID) {
    passport.use('apple', new AppleStrategy({
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
      callbackURL: process.env.APPLE_CALLBACK_URL || '/auth/apple/callback'
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.email || `${profile.id}@apple.local`;
        let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (user.rows.length === 0) {
          const hashPassword = await bcrypt.hash('oauth-' + profile.id, 10);
          user = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, hashPassword]
          );
        }
        
        return done(null, user.rows[0]);
      } catch (err) {
        return done(err);
      }
    }));
  }

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      done(null, result.rows[0]);
    } catch (err) {
      done(err);
    }
  });
};
