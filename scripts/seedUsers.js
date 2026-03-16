const pool = require('../db');
const bcrypt = require('bcryptjs');

// Password format: Wave@XXXX (e.g. Wave@1194)
// Each agent logs in with their company email + Wave@WaveID

const users = [
  { name: "Abdullrahman Ali Mahdi", email: "abdullrahman.mahdi@highperformanceco.net", role: "agent", queue: "Arabic", password: "Wave@1194" },
  { name: "Aya Edris", email: "aya.edris@highperformanceco.net", role: "agent", queue: "Arabic", password: "Wave@1118" },
  { name: "Darbin Omer Abubakr", email: "darbin.abubakr@highperformanceco.net", role: "agent", queue: "Arabic", password: "Wave@1183" },
  { name: "Daryan Bakr Kakamand", email: "daryan.kakmand@highperformanceco.net", role: "agent", queue: "Arabic", password: "Wave@1166" },
  { name: "Mohammad Jalil", email: "mohammad.jalil@highperformanceco.net", role: "agent", queue: "Arabic", password: "Wave@1175" },
  { name: "Ruya Yaqub", email: "ruya.yaqub@highperformanceco.net", role: "agent", queue: "Arabic", password: "Wave@1135" },
  { name: "Salm Khairulla Saeed", email: "salm.saeed@highperformanceco.net", role: "agent", queue: "Arabic", password: "Wave@1149" },
  { name: "Omer Tasim Omer", email: "omer.omer@highperformanceco.net", role: "agent", queue: "Arabic", password: "Wave@1200" },
  { name: "Fremsk Wali Sleman", email: "fremsk.wali@highperformanceco.net", role: "agent", queue: "Arabic", password: "Wave@1209" },
  { name: "Rzgar Ali Isamil", email: "rzgar.ali@highperformanceco.net", role: "agent", queue: "Arabic", password: "Wave@1210" },
  { name: "Ammar Mamnd Salih", email: "ammar.salih@highperformanceco.net", role: "agent", queue: "Badini", password: "Wave@1147" },
  { name: "Azad Brifkani", email: "azad.ameen@highperformanceco.net", role: "agent", queue: "Badini", password: "Wave@1174" },
  { name: "Bahaa Shamsadeen Sulaiman", email: "bahaa.sulaiman@highperformanceco.net", role: "agent", queue: "Badini", password: "Wave@1181" },
  { name: "Haryad Muhsin", email: "haryad.muhsen@highperformanceco.net", role: "agent", queue: "Badini", password: "Wave@1165" },
  { name: "Lara Haval Hassan", email: "lara.hassan@highperformanceco.net", role: "agent", queue: "Badini", password: "Wave@1151" },
  { name: "Muhamad Shakr", email: "muhamad.shakr@highperformanceco.net", role: "agent", queue: "Badini", password: "Wave@1145" },
  { name: "Rasul Najmadeen", email: "rasul.najmadeen@highperformanceco.net", role: "agent", queue: "Badini", password: "Wave@1164" },
  { name: "Yasser Ameen", email: "yasser.ameen@highperformanceco.net", role: "agent", queue: "Badini", password: "Wave@1122" },
  { name: "Muhammed Jalal Majid", email: "muhammed.jalalmajid@highperformanceco.net", role: "agent", queue: "Badini", password: "Wave@1208" },
  { name: "Hakar Hassan Yousif", email: "hakar.hassan@highperformanceco.net", role: "agent", queue: "Badini", password: "Wave@1226" },
  { name: "Salem Mustafa", email: "salem.mustafa@highperformanceco.net", role: "agent", queue: "Badini", password: "Wave@1233" },
  { name: "Amar Kherullah", email: "amar.kherullah@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1243" },
  { name: "Khayam Hassan Suleem", email: "khayam.suleem@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1258" },
  { name: "Abdulrahim Muhammed", email: "abdulrahim.muhammed@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1177" },
  { name: "Ahmed Jasim Rashid", email: "ahmed.rashid@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1189" },
  { name: "Ahmed Rashad", email: "ahmed.rashad@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1176" },
  { name: "Ahmed Saman", email: "ahmed.saman@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1163" },
  { name: "Ali Khalid", email: "ali.khalid@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1092" },
  { name: "Aran Eimad Qadir", email: "aran.qadir@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1193" },
  { name: "Awdang Saman", email: "awdang.saman@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1121" },
  { name: "Barham Haider", email: "barham.haider@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1178" },
  { name: "Didar Pirbal", email: "didar.pirbal@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1143" },
  { name: "Gailan Xalid", email: "gailan.xalid@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1127" },
  { name: "Govand Wali", email: "govand.wali@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1089" },
  { name: "Halland Hemn", email: "halland.hemn@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1123" },
  { name: "Haryad Shakr Abdulla", email: "haryad.abdulla@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1170" },
  { name: "Hawrin Amir Ahmed", email: "hawrin.ahmed@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1188" },
  { name: "Israa Peshkawt", email: "israa.peshkawt@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1168" },
  { name: "Jayran Ali Ahmed", email: "jayran.ali@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1104" },
  { name: "Kaiwan Pshtiwan Mustafa", email: "kaiwan.mustafa@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1173" },
  { name: "Karwan Wali", email: "karwan.wali@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1139" },
  { name: "Lana Tahsin Maghdid", email: "lana.maghdid@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1190" },
  { name: "Malik Rashid", email: "rashid.hasan@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1126" },
  { name: "Mohammed Soran Hassan", email: "mohammed.hassan@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1184" },
  { name: "Muhammad Ali Osman", email: "ali.osman@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1137" },
  { name: "Muhammed Fairq Hadu", email: "muhammed.fairq@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1153" },
  { name: "Mustafa Khudhur Ali", email: "mustafa.khudhur@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1107" },
  { name: "Neamat Anwar Kareem", email: "neamat.anwar@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1108" },
  { name: "Raman Salah Karim", email: "raman.karim@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1185" },
  { name: "Rawaz Muhammed", email: "rawaz.muhammed@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1179" },
  { name: "Rayan Jaafar", email: "rayan.jaafar@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1119" },
  { name: "Redar Ahmed Karim", email: "redar.karim@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1157" },
  { name: "Ronar Rasul", email: "ronar.rasul@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1180" },
  { name: "Safeen Jahfar", email: "safeen.jahfar@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1096" },
  { name: "Salih Sangar", email: "salih.sangar@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1116" },
  { name: "Sarmand Swara Kakakhan", email: "sarmand.swara@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1106" },
  { name: "Sazgar Hassan", email: "sazgar.hassan@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1117" },
  { name: "Shallaw Abdullrahman", email: "shallaw.abdullrahman@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1158" },
  { name: "Sozhin Karim", email: "sozhin.karim@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1114" },
  { name: "Srwd Shwan Hashim", email: "srwd.hashim@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1182" },
  { name: "Yousif Hussein Bahram", email: "yousif.bahram@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1155" },
  { name: "Yousif Sherzad Muhammed", email: "yousif.muhammed@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1156" },
  { name: "Zhiya Najmadin", email: "zhiyar.najmadin@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1162" },
  { name: "Zuher Anwer", email: "zuher.anwer@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1146" },
  { name: "Shaida Faizan Kawiz", email: "shaida.kawiz@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1198" },
  { name: "Lawin Kosrat Saadi", email: "lawin.saadi@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1199" },
  { name: "Bawar Fazl Muhammad", email: "bawar.muhammad@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1203" },
  { name: "Barham Qasim Ahmed", email: "barham.qasim@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1204" },
  { name: "Khayrulla Fuad Bashir", email: "khayrulla.fuadbashir@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1205" },
  { name: "Ahmed Khafut Xdr", email: "ahmed.khafut@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1206" },
  { name: "Muhammed Abdulbari Majid", email: "muhammed.abdulbari@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1207" },
  { name: "Esra Sabah Salim", email: "esra.sabah@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1212" },
  { name: "Dana Ahmed Shawkat", email: "dana.ahmed@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1213" },
  { name: "Karos Kamaran Hussein", email: "karos.hussein@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1214" },
  { name: "Nzar Mohammad Smail", email: "nzar.smail@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1216" },
  { name: "Rama Shorsh Muhammed", email: "rama.muhammed@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1217" },
  { name: "Muhammad Hassan", email: "muhammad.hassan@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1220" },
  { name: "Ahmed Ismail Fathulla", email: "ahmed.fathulla@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1221" },
  { name: "Hero Ayub Omer", email: "hero.omer@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1222" },
  { name: "Sherwan Kaifi Hadi", email: "sherwan.hadi@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1223" },
  { name: "Reband Fakhir Qadr", email: "reband.fakhir@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1228" },
  { name: "Hezha Nuri Ebrahim", email: "hezha.nuri@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1229" },
  { name: "Suhail Subhi Salh", email: "suhail.subhi@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1230" },
  { name: "Ahmed Muhammad Muhammed", email: "ahmed.muhammed@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1231" },
  { name: "Yassin Nihal Salm", email: "yassin.nihal@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1232" },
  { name: "Abdulsamad Nazm Hussein", email: "abdulsamad.nazm@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1234" },
  { name: "Sizar Saadi", email: "sizar.saadi@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1238" },
  { name: "Hema Dhahir Sofi", email: "hema.sofi@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1241" },
  { name: "Ibrahim Rashid", email: "ibrahim.rashid@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1242" },
  { name: "Rebar Mohmmad", email: "rebar.mohmmad@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1244" },
  { name: "Hussen Sangar Hussen", email: "hussen.sangar@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1245" },
  { name: "Bahasht Sabah Omer", email: "bahasht.omer@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1246" },
  { name: "Dabin Ismail Abdulrahman", email: "dabin.ismail@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1247" },
  { name: "Lavan Abbas Noori", email: "lavan.noori@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1248" },
  { name: "Sarkawt Hawro", email: "sarkawt.hawro@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1251" },
  { name: "Brwa Kawa Majid", email: "brwa.majid@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1252" },
  { name: "Meer Ali Kadhim", email: "meer.ali@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1254" },
  { name: "Nihad Abdulmajid", email: "nihad.abdulmajid@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1255" },
  { name: "Abdulrahman AbdulKhaliq", email: "abdulrahman.abdulkhaliq@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1257" },
  { name: "Omer Yaqub Shina", email: "omer.shina@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1259" },
  { name: "Sivar Jawher Ahmed", email: "sivar.ahmed@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1260" },
  { name: "Ibrahim Azad Radha", email: "ibrahim.radha@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1261" },
  { name: "Hussein Mardan Abdulsalam", email: "hussein.abdulsalam@highperformanceco.net", role: "agent", queue: "Sorani", password: "Wave@1215" },
];

async function seedUsers() {
  try {
    let created = 0, skipped = 0;
    for (const u of users) {
      const exists = await pool.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (exists.rows.length > 0) { skipped++; continue; }
      const hash = await bcrypt.hash(u.password, 10);
      await pool.query(
        `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`,
        [u.name, u.email, hash, u.role]
      );
      created++;
    }
    console.log(`✅ Created ${created} users`);
    if (skipped > 0) console.log(`⏭️  Skipped ${skipped} already existing`);

    // Show summary by queue
    console.log('\n📊 Summary by queue:');
    const arabic  = users.filter(u => u.queue === 'Arabic').length;
    const badini  = users.filter(u => u.queue === 'Badini').length;
    const sorani  = users.filter(u => u.queue === 'Sorani').length;
    console.log(`  Arabic:  ${arabic}`);
    console.log(`  Badini:  ${badini}`);
    console.log(`  Sorani:  ${sorani}`);
    console.log(`  Total:   ${users.length}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedUsers();