const pool = require('../db');
const bcrypt = require('bcryptjs');

// ── Step 1: Add 'title' column if it doesn't exist
// ── Step 2: Create / update all management accounts
// Default password for all management: HP@2026!

const DOMAIN = 'highperformanceco.net';

const management = [
  // ── Team Leads (FAQ + Editor + Admin)
  { name: 'Miran Sardar',    email: `miran.sardar@${DOMAIN}`,    role: 'team_lead', title: 'QA Team Lead',          password: 'HP@2026!' },
  { name: 'Rozhin Pshtiwan', email: `rozhin.pshtiwan@${DOMAIN}`, role: 'team_lead', title: 'Operations Team Lead',  password: 'HP@2026!' },
  { name: 'Nashwan Jamil',   email: `nashwan.jamil@${DOMAIN}`,   role: 'team_lead', title: 'Operations Team Lead',  password: 'HP@2026!' },
  { name: 'Blend Sajid',     email: `blend.sajid@${DOMAIN}`,     role: 'team_lead', title: 'Operations Team Lead',  password: 'HP@2026!' },

  // ── Supervisors (FAQ + Editor + Admin)
  { name: 'Masroor Saroya',  email: `masroor.saroya@${DOMAIN}`,  role: 'team_lead', title: 'Supervisor',            password: 'HP@2026!' },
  { name: 'Arsalan Gohar',   email: `arsalan.gohar@${DOMAIN}`,   role: 'team_lead', title: 'Supervisor',            password: 'HP@2026!' },
  { name: 'Bilal Rashid',    email: `bilal.rashid@${DOMAIN}`,    role: 'team_lead', title: 'Supervisor',            password: 'HP@2026!' },

  // ── QA Officers (FAQ + Editor, no Admin)
  { name: 'Mohammed Burhan', email: `mohammed.burhan@${DOMAIN}`, role: 'qa_officer', title: 'QA Officer',           password: 'HP@2026!' },
  { name: 'Sizer Muhsin',    email: `sizer.muhsin@${DOMAIN}`,    role: 'qa_officer', title: 'QA Officer',           password: 'HP@2026!' },

  // ── Team Coordinators (FAQ + Editor, no Admin)
  { name: 'Edres Dldar',     email: `edres.dldar@${DOMAIN}`,     role: 'qa_officer', title: 'Team Coordinator',     password: 'HP@2026!' },
  { name: 'Ali Fuad',        email: `ali.fuad@${DOMAIN}`,        role: 'qa_officer', title: 'Team Coordinator',     password: 'HP@2026!' },
  { name: 'Mohammed Ali',    email: `mohammed.ali@${DOMAIN}`,    role: 'qa_officer', title: 'Team Coordinator',     password: 'HP@2026!' },
];

// QA Officers already seeded as agents — update their role + title
const upgradeAgents = [
  { email: `kaiwan.mustafa@${DOMAIN}`,    role: 'qa_officer', title: 'QA Officer' },
  { email: `rasul.najmadeen@${DOMAIN}`,   role: 'qa_officer', title: 'QA Officer' },
  { email: `ruya.yaqub@${DOMAIN}`,        role: 'qa_officer', title: 'QA Officer' },
  { email: `neamat.anwar@${DOMAIN}`,      role: 'qa_officer', title: 'QA Officer' },
];

async function run() {
  try {
    // ── Add title column
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS title VARCHAR(100) DEFAULT NULL;
    `);
    console.log('✅ title column ready');

    // ── Create new management accounts
    let created = 0, skipped = 0;
    for (const u of management) {
      const exists = await pool.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (exists.rows.length > 0) {
        // Update role + title in case it exists
        await pool.query(
          'UPDATE users SET role = $1, title = $2 WHERE email = $3',
          [u.role, u.title, u.email]
        );
        skipped++;
        continue;
      }
      const hash = await bcrypt.hash(u.password, 10);
      await pool.query(
        `INSERT INTO users (name, email, password, role, title) VALUES ($1,$2,$3,$4,$5)`,
        [u.name, u.email, hash, u.role, u.title]
      );
      created++;
    }
    console.log(`✅ Management: ${created} created, ${skipped} updated`);

    // ── Upgrade existing agents to QA Officer
    let upgraded = 0, notFound = 0;
    for (const u of upgradeAgents) {
      const res = await pool.query(
        'UPDATE users SET role = $1, title = $2 WHERE email = $3 RETURNING name',
        [u.role, u.title, u.email]
      );
      if (res.rows.length > 0) {
        console.log(`  ↑ Upgraded: ${res.rows[0].name} → ${u.role}`);
        upgraded++;
      } else {
        notFound++;
      }
    }
    console.log(`✅ Upgraded ${upgraded} agents to QA Officer`);
    if (notFound > 0) console.log(`⚠️  ${notFound} not found (may already be correct)`);

    // ── Print summary
    console.log('\n📊 Final user count by role:');
    const stats = await pool.query(`
      SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role
    `);
    stats.rows.forEach(r => console.log(`  ${r.role}: ${r.count}`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();