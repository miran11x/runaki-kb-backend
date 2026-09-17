const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/my-feedback', auth, async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM feedback_messages
      WHERE agent_email = $1
      ORDER BY created_at DESC
      `,
      [req.user.email]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to load feedback'
    });
  }
});

module.exports = router;