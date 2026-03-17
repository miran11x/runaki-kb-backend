const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth(['team_lead']), async (req, res) => {
  const r = await pool.query('SELECT id,name,email,role,title,is_active,created_at,last_seen FROM users ORDER BY role,name').catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

router.get('/stats', auth(['team_lead']), async (req, res) => {
  try {
    const [tu, au, tf, tl, by_role, logins_week] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query(`SELECT COUNT(*) FROM active_sessions WHERE last_ping > NOW()-INTERVAL '5 minutes'`),
      pool.query('SELECT COUNT(*) FROM faqs WHERE is_published=true'),
      pool.query(`SELECT COUNT(*) FROM activity_log WHERE action='LOGIN'`),
      pool.query(`SELECT role, COUNT(*) as count FROM users GROUP BY role`),
      pool.query(`
        SELECT DATE(created_at) as day, COUNT(*) as count
        FROM activity_log WHERE action='LOGIN' AND created_at > NOW()-INTERVAL '7 days'
        GROUP BY DATE(created_at) ORDER BY day
      `),
    ]);
    res.json({
      totalUsers: parseInt(tu.rows[0].count),
      activeNow: parseInt(au.rows[0].count),
      totalFAQs: parseInt(tf.rows[0].count),
      totalLogins: parseInt(tl.rows[0].count),
      byRole: by_role.rows,
      loginsWeek: logins_week.rows,
    });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/active-count', auth(['team_lead','qa_officer']), async (req, res) => {
  const r = await pool.query(`SELECT COUNT(*) FROM active_sessions WHERE last_ping > NOW()-INTERVAL '5 minutes'`).catch(() => null);
  r ? res.json({ count: parseInt(r.rows[0].count) }) : res.status(500).json({ error: 'Server error' });
});

router.get('/active-list', auth(['team_lead']), async (req, res) => {
  const r = await pool.query(`
    SELECT u.id,u.name,u.email,u.role,u.title,s.last_ping
    FROM active_sessions s JOIN users u ON u.id=s.user_id
    WHERE s.last_ping > NOW()-INTERVAL '5 minutes' ORDER BY s.last_ping DESC
  `).catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

router.get('/activity', auth(['team_lead']), async (req, res) => {
  const r = await pool.query(`
    SELECT l.id,u.name,u.role,u.title,l.action,l.details,l.created_at
    FROM activity_log l JOIN users u ON u.id=l.user_id
    ORDER BY l.created_at DESC LIMIT 100
  `).catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

router.post('/', auth(['team_lead']), async (req, res) => {
  const { name, email, password, role, title } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, password required' });
  try {
    const ex = await pool.query('SELECT id FROM users WHERE email=$1', [email.toLowerCase()]);
    if (ex.rows.length) return res.status(409).json({ error: 'Email exists' });
    const hash = await bcrypt.hash(password, 10);
    const r = await pool.query(
      'INSERT INTO users(name,email,password,role,title) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,role,title,is_active,created_at',
      [name, email.toLowerCase(), hash, role || 'agent', title || null]
    );
    res.status(201).json(r.rows[0]);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.patch('/:id', auth(['team_lead']), async (req, res) => {
  const { role, is_active, name, title } = req.body;
  const fields = [], vals = [];
  let i = 1;
  if (role)              { fields.push(`role=$${i++}`);      vals.push(role); }
  if (is_active !== undefined) { fields.push(`is_active=$${i++}`); vals.push(is_active); }
  if (name)              { fields.push(`name=$${i++}`);      vals.push(name); }
  if (title !== undefined) { fields.push(`title=$${i++}`);   vals.push(title); }
  if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });
  vals.push(req.params.id);
  const r = await pool.query(`UPDATE users SET ${fields.join(',')} WHERE id=$${i} RETURNING *`, vals).catch(() => null);
  r ? res.json(r.rows[0]) : res.status(500).json({ error: 'Server error' });
});

router.delete('/:id', auth(['team_lead']), async (req, res) => {
  if (parseInt(req.params.id) === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]).catch(() => {});
  res.json({ ok: true });
});

router.post('/:id/reset-password', auth(['team_lead']), async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ error: 'Password required' });
  const hash = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hash, req.params.id]);
  res.json({ ok: true });
});

module.exports = router;

// GET agent leaderboard (team_lead only)
router.get('/leaderboard', auth(['team_lead']), async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT u.id, u.name, u.title, u.role,
        COUNT(DISTINCT fv.faq_id) as faqs_viewed,
        COUNT(DISTINCT b.faq_id) as bookmarks,
        COUNT(DISTINCT fr.faq_id) FILTER (WHERE fr.helpful=true) as helpful_ratings,
        MAX(u.last_seen) as last_seen
      FROM users u
      LEFT JOIN faq_views fv ON fv.user_id = u.id
      LEFT JOIN bookmarks b ON b.user_id = u.id
      LEFT JOIN faq_ratings fr ON fr.user_id = u.id
      WHERE u.role = 'agent' AND u.is_active = true
      GROUP BY u.id, u.name, u.title, u.role
      ORDER BY faqs_viewed DESC, bookmarks DESC
      LIMIT 20
    `);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});