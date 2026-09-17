const pool = require('../db');
const bcrypt = require('bcryptjs');

async function fix() {
  try {
    // These 4 were in the agents list but need to be QA Officers
    // Adding them fresh with qa_officer role
    const officers = [
      { name: 'Kaiwan Pshtiwan Mustafa', email: 'kaiwan.mustafa@highperformanceco.net',  title: 'QA Officer', wave: 1173 },
      { name: 'Rasul Najmadeen',         email: 'rasul.najmadeen@highperformanceco.net', title: 'QA Officer', wave: 1164 },
      { name: 'Ruya Yaqub',              email: 'ruya.yaqub@highperformanceco.net',      title: 'QA Officer', wave: 1135 },
      { name: 'Neamat Anwar Kareem',     email: 'neamat.anwar@highperformanceco.net',    title: 'QA Officer', wave: 1108 },
    ];

    for (const u of officers) {
      // Check if exists
      const exists = await pool.query(
        'SELECT id, role, email FROM users WHERE LOWER(email) = LOWER($1)', [u.email]
      );

      if (exists.rows.length > 0) {
        // Update role
        await pool.query(
          'UPDATE users SET role = $1, title = $2 WHERE id = $3',
          ['qa_officer', u.title, exists.rows[0].id]
        );
        console.log(`✅ Updated: ${u.name} → qa_officer`);
      } else {
        // Create fresh
        const hash = await bcrypt.hash(`Wave@${u.wave}`, 10);
        await pool.query(
          'INSERT INTO users (name, email, password, role, title) VALUES ($1,$2,$3,$4,$5)',
          [u.name, u.email.toLowerCase(), hash, 'qa_officer', u.title]
        );
        console.log(`✅ Created: ${u.name} (Wave@${u.wave})`);
      }
    }

    // Show all users with qa_officer role
    console.log('\n👤 All QA Officers now:');
    const res = await pool.query(
      `SELECT name, email, title FROM users WHERE role = 'qa_officer' ORDER BY name`
    );
    res.rows.forEach(u => console.log(`  ${u.name} — ${u.title} (${u.email})`));

    console.log('\n📊 Role counts:');
    const stats = await pool.query(`SELECT role, COUNT(*) FROM users GROUP BY role ORDER BY role`);
    stats.rows.forEach(r => console.log(`  ${r.role}: ${r.count}`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fix();