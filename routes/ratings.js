const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Rate a FAQ
router.post('/:faq_id', auth(), async (req, res) => {
  const { faq_id } = req.params;
  const { helpful } = req.body;
  try {
    await pool.query(`
      INSERT INTO faq_ratings (user_id, faq_id, helpful)
      VALUES ($1,$2,$3)
      ON CONFLICT (user_id, faq_id) DO UPDATE SET helpful=$3
    `, [req.user.id, faq_id, helpful]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// GET ratings for a FAQ
router.get('/:faq_id', auth(), async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE helpful=true) as helpful,
        COUNT(*) FILTER (WHERE helpful=false) as not_helpful,
        MAX(CASE WHEN user_id=$1 THEN helpful END) as my_rating
      FROM faq_ratings WHERE faq_id=$2
    `, [req.user.id, req.params.faq_id]);
    res.json(r.rows[0]);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// GET my ratings (all at once for fast load)
router.get('/mine/all', auth(), async (req, res) => {
  const r = await pool.query('SELECT faq_id, helpful FROM faq_ratings WHERE user_id=$1', [req.user.id]).catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

module.exports = router;