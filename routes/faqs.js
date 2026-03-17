const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET all published FAQs
router.get('/', auth(), async (req, res) => {
  const r = await pool.query(`
    SELECT f.*,u.name as created_by_name,u2.name as updated_by_name
    FROM faqs f LEFT JOIN users u ON u.id=f.created_by LEFT JOIN users u2 ON u2.id=f.updated_by
    WHERE f.is_published=true ORDER BY f.category,f.subcategory,f.id
  `).catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

// GET all FAQs including drafts (editors/team leads)
router.get('/all', auth(['qa_officer','team_lead']), async (req, res) => {
  const r = await pool.query(`
    SELECT f.*,u.name as created_by_name FROM faqs f LEFT JOIN users u ON u.id=f.created_by ORDER BY f.created_at DESC
  `).catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

// GET top viewed FAQs
router.get('/top-viewed', auth(['team_lead','qa_officer']), async (req, res) => {
  const r = await pool.query(`SELECT id,question_en,category,views FROM faqs WHERE is_published=true ORDER BY views DESC LIMIT 10`).catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

// GET all notifications
router.get('/notifications/all', auth(), async (req, res) => {
  const r = await pool.query(`
    SELECT n.*,u.name as sender_name FROM notifications n
    LEFT JOIN users u ON u.id=n.created_by ORDER BY n.created_at DESC LIMIT 20
  `).catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

// POST new notification
router.post('/notifications', auth(['qa_officer','team_lead']), async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).json({ error: 'Title and message required' });
  const r = await pool.query(
    'INSERT INTO notifications(title,message,created_by) VALUES($1,$2,$3) RETURNING *',
    [title, message, req.user.id]
  ).catch(() => null);
  r ? res.status(201).json(r.rows[0]) : res.status(500).json({ error: 'Server error' });
});

// GET single FAQ by id
router.get('/:id', auth(), async (req, res) => {
  const r = await pool.query('SELECT * FROM faqs WHERE id=$1', [req.params.id]).catch(() => null);
  if (!r || !r.rows.length) return res.status(404).json({ error: 'FAQ not found' });
  res.json(r.rows[0]);
});

// POST view count
router.post('/:id/view', auth(), async (req, res) => {
  await pool.query('INSERT INTO faq_views(faq_id,user_id) VALUES($1,$2)', [req.params.id, req.user.id]).catch(() => {});
  await pool.query('UPDATE faqs SET views=views+1 WHERE id=$1', [req.params.id]).catch(() => {});
  res.json({ ok: true });
});

// POST create FAQ
router.post('/', auth(['qa_officer','team_lead']), async (req, res) => {
  const { category, subcategory, question_en, answer_en, question_ku, answer_ku, tags, is_published, tags_arr } = req.body;
  if (!category || !question_en || !answer_en) return res.status(400).json({ error: 'Category, question, answer required' });
  const r = await pool.query(`
    INSERT INTO faqs(category,subcategory,question_en,answer_en,question_ku,answer_ku,tags,is_published,created_by)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *
  `, [category, subcategory, question_en, answer_en, question_ku||null, answer_ku||null, tags||null, is_published!==false, req.user.id]).catch(() => null);
  if (!r) return res.status(500).json({ error: 'Server error' });
  await pool.query(`INSERT INTO activity_log(user_id,action,details) VALUES($1,'CREATE_FAQ',$2)`,
    [req.user.id, `Created: "${question_en.substring(0,60)}"`]);
  res.status(201).json(r.rows[0]);
});

// PUT update FAQ
router.put('/:id', auth(['qa_officer','team_lead']), async (req, res) => {
  const { category, subcategory, question_en, answer_en, question_ku, answer_ku, tags, is_published, tags_arr } = req.body;
  const r = await pool.query(`
    UPDATE faqs SET category=$1,subcategory=$2,question_en=$3,answer_en=$4,
    question_ku=$5,answer_ku=$6,tags=$7,is_published=$8,updated_by=$9,updated_at=NOW()
    WHERE id=$10 RETURNING *
  `, [category, subcategory, question_en, answer_en, question_ku, answer_ku, tags, is_published, req.user.id, req.params.id]).catch(() => null);
  if (!r) return res.status(500).json({ error: 'Server error' });
  await pool.query(`INSERT INTO activity_log(user_id,action,details) VALUES($1,'UPDATE_FAQ',$2)`,
    [req.user.id, `Updated FAQ #${req.params.id}`]);
  res.json(r.rows[0]);
});

// DELETE FAQ
router.delete('/:id', auth(['team_lead']), async (req, res) => {
  await pool.query('DELETE FROM faqs WHERE id=$1', [req.params.id]).catch(() => {});
  await pool.query(`INSERT INTO activity_log(user_id,action,details) VALUES($1,'DELETE_FAQ',$2)`,
    [req.user.id, `Deleted FAQ #${req.params.id}`]);
  res.json({ ok: true });
});


// GET FAQs by tag
router.get('/by-tag/:tag', auth(), async (req, res) => {
  const r = await pool.query(
    `SELECT * FROM faqs WHERE $1 = ANY(tags_arr) AND is_published=true ORDER BY category, subcategory`,
    [req.params.tag]
  ).catch(() => null);
  r ? res.json(r.rows) : res.status(500).json({ error: 'Server error' });
});

// GET all unique tags
router.get('/tags/all', auth(), async (req, res) => {
  const r = await pool.query(
    `SELECT DISTINCT unnest(tags_arr) as tag FROM faqs WHERE array_length(tags_arr,1) > 0 ORDER BY tag`
  ).catch(() => null);
  r ? res.json(r.rows.map(x => x.tag)) : res.status(500).json({ error: 'Server error' });
});

module.exports = router;