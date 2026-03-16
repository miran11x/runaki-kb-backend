const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const auth = require('../middleware/auth');
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const r = await pool.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
    if (!r.rows.length) return res.status(401).json({ error: 'Invalid email or password' });
    const user = r.rows[0];
    if (!user.is_active) return res.status(403).json({ error: 'Account deactivated' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, title: user.title },
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    await pool.query('UPDATE users SET last_seen=NOW() WHERE id=$1', [user.id]);
    await pool.query(`INSERT INTO activity_log(user_id,action,details) VALUES($1,'LOGIN',$2)`, [user.id, `${user.name} logged in`]);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, title: user.title } });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
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
    const r = await pool.query('SELECT id,name,email,role,title,created_at,last_seen FROM users WHERE id=$1', [req.user.id]);
    res.json(r.rows[0]);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;