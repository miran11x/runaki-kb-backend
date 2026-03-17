const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET my bookmarks
router.get('/', auth(), async (req, res) => {
  const r = await pool.query(`
    SELECT f.*, b.created_at as bookmarked_at
    FROM bookmarks b JOIN faqs f ON f.id = b.faq_id
    WHERE b.user_id = $1 AND f.is_published = true
    ORDER BY b.created_at DESC
  `, [req.user.id]).catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

// TOGGLE bookmark
router.post('/:faq_id', auth(), async (req, res) => {
  const { faq_id } = req.params;
  try {
    const existing = await pool.query('SELECT id FROM bookmarks WHERE user_id=$1 AND faq_id=$2', [req.user.id, faq_id]);
    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM bookmarks WHERE user_id=$1 AND faq_id=$2', [req.user.id, faq_id]);
      res.json({ bookmarked: false });
    } else {
      await pool.query('INSERT INTO bookmarks (user_id, faq_id) VALUES ($1,$2)', [req.user.id, faq_id]);
      res.json({ bookmarked: true });
    }
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// GET my bookmark IDs only (for fast lookup)
router.get('/ids', auth(), async (req, res) => {
  const r = await pool.query('SELECT faq_id FROM bookmarks WHERE user_id=$1', [req.user.id]).catch(() => null);
  r ? res.json(r.rows.map(x => x.faq_id)) : res.status(500).json({ error: 'Server error' });
});

module.exports = router;