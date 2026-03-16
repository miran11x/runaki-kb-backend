const pool = require('../db');
const bcrypt = require('bcryptjs');

async function init() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'agent' CHECK (role IN ('agent','qa_officer','team_lead')),
        title VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        last_seen TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(100),
        question_en TEXT NOT NULL,
        answer_en TEXT NOT NULL,
        question_ku TEXT,
        answer_ku TEXT,
        tags VARCHAR(255),
        is_published BOOLEAN DEFAULT true,
        views INTEGER DEFAULT 0,
        created_by INTEGER REFERENCES users(id),
        updated_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS active_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        last_ping TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_tips (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        is_active BOOLEAN DEFAULT true,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100),
        details TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS faq_views (
        id SERIAL PRIMARY KEY,
        faq_id INTEGER REFERENCES faqs(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        viewed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Default admin
    const ex = await pool.query(`SELECT id FROM users WHERE email='admin@runaki.com'`);
    if (ex.rows.length === 0) {
      const hash = await bcrypt.hash('Admin@2026', 10);
      await pool.query(
        `INSERT INTO users (name,email,password,role,title) VALUES ('Admin','admin@runaki.com',$1,'team_lead','QA Team Lead')`,
        [hash]
      );
      console.log('✅ Default admin: admin@runaki.com / Admin@2026');
    }

    console.log('✅ Database initialized');
    process.exit(0);
  } catch (err) {
    console.error('❌', err.message);
    process.exit(1);
  }
}

init();