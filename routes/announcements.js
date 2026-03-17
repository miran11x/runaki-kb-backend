const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET all announcements (agents see latest 5, admins see all)
router.get('/', auth(), async (req, res) => {
  const limit = req.user.role === 'team_lead' ? 100 : 5;
  const r = await pool.query(`
    SELECT a.*, u.name as created_by_name
    FROM announcements a LEFT JOIN users u ON u.id = a.created_by
    ORDER BY a.created_at DESC LIMIT $1
  `, [limit]).catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

// POST create announcement (team_lead only)
router.post('/', auth(['team_lead']), async (req, res) => {
  const { title, message, priority } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO announcements (title, message, priority, created_by) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, message, priority || 'normal', req.user.id]
    );
    await pool.query(`INSERT INTO activity_log (user_id, action, details) VALUES ($1,'ANNOUNCEMENT',$2)`, [req.user.id, `Sent announcement: ${title}`]);
    res.json(r.rows[0]);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// DELETE announcement
router.delete('/:id', auth(['team_lead']), async (req, res) => {
  await pool.query('DELETE FROM announcements WHERE id=$1', [req.params.id]).catch(() => null);
  res.json({ success: true });
});

module.exports = router;