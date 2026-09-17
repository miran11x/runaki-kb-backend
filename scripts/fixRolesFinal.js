const pool = require('../db');

async function fix() {
  try {
    // Step 1: Update any remaining old role names
    await pool.query(`UPDATE users SET role = 'team_lead' WHERE role = 'admin'`);
    await pool.query(`UPDATE users SET role = 'qa_officer' WHERE role = 'editor'`);
    console.log('✅ Old roles (admin/editor) converted');

    // Step 2: Now drop and recreate constraint cleanly
    await pool.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check`);
    await pool.query(`
      ALTER TABLE users ADD CONSTRAINT users_role_check 
      CHECK (role IN ('agent', 'qa_officer', 'team_lead'))
    `);
    console.log('✅ Constraint updated');

    // Step 3: Set titles for accounts missing them
    const titleMap = [
      { email: 'admin@runaki.com',              title: 'QA Team Lead' },
      { email: 'miran.sardar@highperformanceco.net',    title: 'QA Team Lead' },
      { email: 'rozhin.pshtiwan@highperformanceco.net', title: 'Operations Team Lead' },
      { email: 'nashwan.jamil@highperformanceco.net',   title: 'Operations Team Lead' },
      { email: 'blend.sajid@highperformanceco.net',     title: 'Operations Team Lead' },
      { email: 'masroor.saroya@highperformanceco.net',  title: 'Supervisor' },
      { email: 'arsalan.gohar@highperformanceco.net',   title: 'Supervisor' },
      { email: 'bilal.rashid@highperformanceco.net',    title: 'Supervisor' },
      { email: 'kaiwan.mustafa@highperformanceco.net',  title: 'QA Officer' },
      { email: 'rasul.najmadeen@highperformanceco.net', title: 'QA Officer' },
      { email: 'ruya.yaqub@highperformanceco.net',      title: 'QA Officer' },
      { email: 'neamat.anwar@highperformanceco.net',    title: 'QA Officer' },
      { email: 'mohammed.burhan@highperformanceco.net', title: 'QA Officer' },
      { email: 'sizer.muhsin@highperformanceco.net',    title: 'QA Officer' },
      { email: 'edres.dldar@highperformanceco.net',     title: 'Team Coordinator' },
      { email: 'ali.fuad@highperformanceco.net',        title: 'Team Coordinator' },
      { email: 'mohammed.ali@highperformanceco.net',    title: 'Team Coordinator' },
    ];

    for (const t of titleMap) {
      await pool.query(
        `UPDATE users SET title = $1 WHERE LOWER(email) = LOWER($2)`,
        [t.title, t.email]
      );
    }
    console.log('✅ Titles set');

    // Step 4: Upgrade QA officers that were seeded as agents
    const qaOfficers = [
      'kaiwan.mustafa@highperformanceco.net',
      'rasul.najmadeen@highperformanceco.net',
      'ruya.yaqub@highperformanceco.net',
      'neamat.anwar@highperformanceco.net',
    ];
    for (const email of qaOfficers) {
      const res = await pool.query(
        `UPDATE users SET role = 'qa_officer' WHERE LOWER(email) = LOWER($1) AND role = 'agent' RETURNING name`,
        [email]
      );
      if (res.rows.length > 0) console.log(`  ↑ Upgraded: ${res.rows[0].name}`);
    }

    // Step 5: Final summary
    console.log('\n📊 Final roles:');
    const stats = await pool.query(`SELECT role, COUNT(*) FROM users GROUP BY role ORDER BY role`);
    stats.rows.forEach(r => console.log(`  ${r.role}: ${r.count}`));

    console.log('\n👤 Management accounts:');
    const mgmt = await pool.query(`
      SELECT name, email, role, title FROM users 
      WHERE role IN ('team_lead','qa_officer') 
      ORDER BY role, name
    `);
    mgmt.rows.forEach(u => console.log(`  [${u.role}] ${u.name} — ${u.title || '—'} (${u.email})`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fix();