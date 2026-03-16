const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth',  require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/faqs',  require('./routes/faqs'));
app.use('/api/tips',  require('./routes/tips'));
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

// Clean stale sessions every 10 min
const pool = require('./db');
setInterval(async () => {
  await pool.query(`DELETE FROM active_sessions WHERE last_ping < NOW()-INTERVAL '10 minutes'`).catch(() => {});
}, 10 * 60 * 1000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Runaki KB v2 → http://localhost:${PORT}`));