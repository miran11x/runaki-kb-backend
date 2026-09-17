const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET latest active tip (agents see this)
router.get('/latest', auth(), async (req, res) => {
  const r = await pool.query(`
    SELECT t.*,u.name as author FROM daily_tips t
    LEFT JOIN users u ON u.id=t.created_by
    WHERE t.is_active=true ORDER BY t.created_at DESC LIMIT 1
  `).catch(() => null);
  r ? res.json(r.rows[0] || null) : res.status(500).json({ error: 'Server error' });
});

// GET all tips (editors/team leads)
router.get('/', auth(['qa_officer','team_lead']), async (req, res) => {
  const r = await pool.query(`
    SELECT t.*,u.name as author FROM daily_tips t
    LEFT JOIN users u ON u.id=t.created_by
    ORDER BY t.created_at DESC LIMIT 20
  `).catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

// POST new tip
router.post('/', auth(['qa_officer','team_lead']), async (req, res) => {
  const { title, content, category, publish_at } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
  try {
    // Deactivate all old tips first
    await pool.query('UPDATE daily_tips SET is_active=false');
    const r = await pool.query(
      'INSERT INTO daily_tips(title,content,category,is_active,created_by,publish_at) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, content, category||'General', publish_at ? false : true, req.user.id, publish_at || null]
    );
    await pool.query(`INSERT INTO activity_log(user_id,action,details) VALUES($1,'CREATE_TIP',$2)`, [req.user.id, `Posted tip: "${title}"`]);
    res.status(201).json(r.rows[0]);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// PATCH toggle active
router.patch('/:id/toggle', auth(['qa_officer','team_lead']), async (req, res) => {
  try {
    await pool.query('UPDATE daily_tips SET is_active=false');
    await pool.query('UPDATE daily_tips SET is_active=true WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// DELETE tip
router.delete('/:id', auth(['team_lead']), async (req, res) => {
  await pool.query('DELETE FROM daily_tips WHERE id=$1', [req.params.id]).catch(() => {});
  res.json({ ok: true });
});


// GET - check and auto-publish scheduled tips (called by frontend polling)
router.post('/check-scheduled', auth(), async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT id FROM daily_tips
      WHERE publish_at IS NOT NULL AND publish_at <= NOW() AND is_active = false
      ORDER BY publish_at LIMIT 1
    `);
    if (r.rows.length > 0) {
      await pool.query('UPDATE daily_tips SET is_active=false');
      await pool.query('UPDATE daily_tips SET is_active=true WHERE id=$1', [r.rows[0].id]);
      res.json({ published: true });
    } else {
      res.json({ published: false });
    }
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;