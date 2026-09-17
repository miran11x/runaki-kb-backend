const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const pool = require('../db');
const auth = require('../middleware/auth');
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      error: 'Identifier and password required'
    });
  }

  try {
   const r = await pool.query(
  `
  SELECT *
  FROM users
  WHERE (
    role = 'agent'
    AND wave_id = $1
  )
  OR (
    role <> 'agent'
    AND LOWER(email) = LOWER($1)
  )
  LIMIT 1
  `,
  [identifier.trim()]
);

    if (!r.rows.length) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const user = r.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        error: 'Account deactivated'
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    if (user.mfa_enabled) {
  return res.json({
    ok: true,
    mfaRequired: true,
    userId: user.id
  });
}

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        wave_id: user.wave_id,
        role: user.role,
        title: user.title
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    await pool.query(
      'UPDATE users SET last_seen = NOW() WHERE id = $1',
      [user.id]
    );

    await pool.query(
      `
      INSERT INTO activity_log(user_id, action, details)
      VALUES ($1, 'LOGIN', $2)
      `,
      [user.id, `${user.name} logged in`]
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        wave_id: user.wave_id,
        role: user.role,
        title: user.title
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error'
    });
  }
});


router.post('/ping', auth(), async (req, res) => {
  try {
    await pool.query(`INSERT INTO active_sessions(user_id,last_ping) VALUES($1,NOW()) ON CONFLICT(user_id) DO UPDATE SET last_ping=NOW()`, [req.user.id]);
    await pool.query('UPDATE users SET last_seen=NOW() WHERE id=$1', [req.user.id]);
    res.json({ ok: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/logout', auth(), async (req, res) => {
  try {
    await pool.query('DELETE FROM active_sessions WHERE user_id=$1', [req.user.id]);
    await pool.query(`INSERT INTO activity_log(user_id,action,details) VALUES($1,'LOGOUT',$2)`, [req.user.id, `${req.user.name} logged out`]);
    res.json({ ok: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.get('/me', auth(), async (req, res) => {
  try {
    const r = await pool.query('SELECT id,name,email,wave_id,role,title,created_at,last_seen FROM users WHERE id=$1', [req.user.id]);
    res.json(r.rows[0]);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/verify-mfa', async (req, res) => {
  const { userId, code } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const user = result.rows[0];

    const verified = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!verified) {
      return res.status(401).json({
        error: 'Invalid authenticator code'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        wave_id: user.wave_id,
        role: user.role,
        title: user.title
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    await pool.query(
      'UPDATE users SET last_seen = NOW() WHERE id = $1',
      [user.id]
    );

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        wave_id: user.wave_id,
        role: user.role,
        title: user.title
      }
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Server error'
    });
  }
});


module.exports = router;