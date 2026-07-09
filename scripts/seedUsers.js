const pool = require('../db');
const bcrypt = require('bcryptjs');

// Password format: Wave@XXXX (e.g. Wave@1194)
// Each agent logs in with their company email + Wave@WaveID

const users = [
  { name: "Abdullrahman Ali Mahdi", email: "abdullrahman.mahdi@highperformanceco.net", wave_id: "1194", role: "agent", queue: "Arabic", password: "Wave@1194" },
  { name: "Aya Edris", email: "aya.edris@highperformanceco.net", wave_id: "1118", role: "agent", queue: "Arabic", password: "Wave@1118" },
  { name: "Darbin Omer Abubakr", email: "darbin.abubakr@highperformanceco.net", wave_id: "1183", role: "agent", queue: "Arabic", password: "Wave@1183" },
  { name: "Daryan Bakr Kakamand", email: "daryan.kakmand@highperformanceco.net", wave_id: "1166", role: "agent", queue: "Arabic", password: "Wave@1166" },
  { name: "Mohammad Jalil", email: "mohammad.jalil1@highperformanceco.net", wave_id: "1175", role: "agent", queue: "Arabic", password: "Wave@1175" },
  { name: "Omer Tasim Omer", email: "omer.Omer@highperformanceco.net", wave_id: "1200", role: "agent", queue: "Arabic", password: "Wave@1200" },
  { name: "Fremsk Wali Sleman", email: "fremsk.wali@highperformanceco.net", wave_id: "1209", role: "agent", queue: "Arabic", password: "Wave@1209" },
  { name: "Sulala Amanj Dlzar", email: "sulala.dlzar@highperformanceco.net", wave_id: "1111", role: "agent", queue: "Arabic", password: "Wave@1111" },
  { name: "Ahmed Jasim Rashid", email: "ahmed.rashid@highperformanceco.net", wave_id: "1189", role: "agent", queue: "Arabic", password: "Wave@1189" },
  { name: "Redar ahmed karim", email: "redar.karim@highperformanceco.net", wave_id: "1157", role: "agent", queue: "Arabic", password: "Wave@1157" },
  { name: "khayrulla Fuad Bashir", email: "khayrulla.fuadbashir1@highperformanceco.net", wave_id: "1205", role: "agent", queue: "Arabic", password: "Wave@1205" },
  { name: "Ayam Saed", email: "ayam.saed@highperformanceco.net", wave_id: "1128", role: "agent", queue: "Arabic", password: "Wave@1128" },
  { name: "Jan Diyare", email: "jan.diyare@highperformanceco.net", wave_id: "1129", role: "agent", queue: "Arabic", password: "Wave@1129" },
  { name: "Jwan Qais Rashid", email: "jwan.qais@highperformanceco.net", wave_id: "1150", role: "agent", queue: "Arabic", password: "Wave@1150" },
  { name: "Ali ezzadein ismeail", email: "ali.ismeail@highperformanceco.net", wave_id: "1167", role: "agent", queue: "Arabic", password: "Wave@1167" },
  { name: "Abdulla ahmed shareef", email: "abdullah.ahmed@highperformanceco.net", wave_id: "1124", role: "agent", queue: "Arabic", password: "Wave@1124" },
  { name: "Mohmmed Askander muhammed", email: "mohmmed.askander@highperformanceco.net", wave_id: "1272", role: "agent", queue: "Arabic", password: "Wave@1272" },
  { name: "Mustafa Ahmed Abdullah", email: "mustafa.ahmed@highperformanceco.net", wave_id: "1195", role: "agent", queue: "Arabic", password: "Wave@1195" },
  { name: "Vagr Muhamed Salih", email: "vagr.muhamed@highperformanceco.net", wave_id: "1201", role: "agent", queue: "Arabic", password: "Wave@1201" },
  { name: "Muhamad Saleem muhammed", email: "muhamad.saleem@highperformanceco.net", wave_id: "1293", role: "agent", queue: "Arabic", password: "Wave@1293" },
  { name: "Abdulrahman  Shuaib Hamid", email: "abdulrahman.shuaib@highperformanceco.net", wave_id: "1295", role: "agent", queue: "Arabic", password: "Wave@1295" },
  { name: "Aso haidar majid", email: "aso.haider@highperformanceco.net", wave_id: "1316", role: "agent", queue: "Arabic", password: "Wave@1316" },
  { name: "Mazn Najat noori", email: "najat.noori@highperformanceco.net", wave_id: "1148", role: "agent", queue: "Arabic", password: "Wave@1148" },
  { name: "Amin Ismael Khudur", email: "amin.ismael@highperformanceco.net", wave_id: "1341", role: "agent", queue: "Arabic", password: "Wave@1341" },
  { name: "Abdulrahman AbdulKhaliq", email: "abdulrahman.abdulKhaliq@highperformanceco.net", wave_id: "1257", role: "agent", queue: "Arabic", password: "Wave@1257" },
  { name: "Kanary Wasman", email: "kanary.wasman@highperformanceco.net", wave_id: "1345", role: "agent", queue: "Arabic", password: "Wave@1345" },
  { name: "Barzan Jassim", email: "barzan.jassim@highperformanceco.net", wave_id: "1349", role: "agent", queue: "Arabic", password: "Wave@1349" },
  { name: "Salar Namiq Mohammed", email: "salar.namiq@highperformanceco.net", wave_id: "1138", role: "agent", queue: "Badini", password: "Wave@1138" },
  { name: "Ammar Mamnd Salih", email: "ammar.salih@highperformanceco.net", wave_id: "1147", role: "agent", queue: "Badini", password: "Wave@1147" },
  { name: "Azad Brifkani", email: "azad.ameen@highperformanceco.net", wave_id: "1174", role: "agent", queue: "Badini", password: "Wave@1174" },
  { name: "Bahaa Shamsadeen Sulaiman", email: "bahaa.sulaiman@highperformanceco.net", wave_id: "1181", role: "agent", queue: "Badini", password: "Wave@1181" },
  { name: "Haryad Muhsin", email: "haryad.muhsen@highperformanceco.net", wave_id: "1165", role: "agent", queue: "Badini", password: "Wave@1165" },
  { name: "Lara Haval Hassan", email: "lara.hassan@highperformanceco.net", wave_id: "1151", role: "agent", queue: "Badini", password: "Wave@1151" },
  { name: "Yasser Ameen", email: "yasser.ameen@highperformanceco.net", wave_id: "1122", role: "agent", queue: "Badini", password: "Wave@1122" },
  { name: "Muhammed Jalal majid", email: "muhammed.jalalmajid1@highperformanceco.net", wave_id: "1208", role: "agent", queue: "Badini", password: "Wave@1208" },
  { name: "Ahmed Nabeel Sabir", email: "ahmed.sabir@highperformanceco.net", wave_id: "1109", role: "agent", queue: "Badini", password: "Wave@1109" },
  { name: "Sadulla Husen Faqe", email: "sadulla.faqe@highperformanceco.net", wave_id: "1112", role: "agent", queue: "Badini", password: "Wave@1112" },
  { name: "Mehran Hatam", email: "mehran.hatam@highperformanceco.net", wave_id: "1130", role: "agent", queue: "Badini", password: "Wave@1130" },
  { name: "Raad Mikaeel", email: "raad.mikaeel@highperformanceco.net", wave_id: "1131", role: "agent", queue: "Badini", password: "Wave@1131" },
  { name: "Zirak Jamal", email: "zirak.jamal@highperformanceco.net", wave_id: "1132", role: "agent", queue: "Badini", password: "Wave@1132" },
  { name: "Zarya Ibrahim", email: "zarya.ibrahim@highperformanceco.net", wave_id: "1134", role: "agent", queue: "Badini", password: "Wave@1134" },
  { name: "Hawkar Jamil Ahmed", email: "hawkar.jamil@highperformanceco.net", wave_id: "1141", role: "agent", queue: "Badini", password: "Wave@1141" },
  { name: "Muhanad Shawkat Farman", email: "muhanad.shawkat@highperformanceco.net", wave_id: "1152", role: "agent", queue: "Badini", password: "Wave@1152" },
  { name: "Mubeen Waleed edres", email: "mubeen.edres@highperformanceco.net", wave_id: "1159", role: "agent", queue: "Badini", password: "Wave@1159" },
  { name: "Sidad Mikeail zarda", email: "sidad.mikeail@highperformanceco.net", wave_id: "1218", role: "agent", queue: "Badini", password: "Wave@1218" },
  { name: "Muhammaed Mustafa abdulwahid", email: "muhammed.mustafa@highperformanceco.net", wave_id: "1225", role: "agent", queue: "Badini", password: "Wave@1225" },
  { name: "Farhad majid hussein", email: "farhad.majid@highperformanceco.net", wave_id: "1278", role: "agent", queue: "Badini", password: "Wave@1278" },
  { name: "Zaid Aziz Khan", email: "zaid.aziz@highperformanceco.net", wave_id: "1296", role: "agent", queue: "Badini", password: "Wave@1296" },
  { name: "Mohammed ziad yousif", email: "mohammed.ziad@highperformanceco.net", wave_id: "1297", role: "agent", queue: "Badini", password: "Wave@1297" },
  { name: "Zanyar kamaran abdulla", email: "zanyar.kamaran@highperformanceco.net", wave_id: "1299", role: "agent", queue: "Badini", password: "Wave@1299" },
  { name: "Mihran farhad ibrahim", email: "mihran.farhad@highperformanceco.net", wave_id: "1300", role: "agent", queue: "Badini", password: "Wave@1300" },
  { name: "Sina Kharej Nabi", email: "sina.kharej@highperformanceco.net", wave_id: "1301", role: "agent", queue: "Badini", password: "Wave@1301" },
  { name: "Saeed Sanan Taha", email: "saeed.sanan@highperformanceco.net", wave_id: "1302", role: "agent", queue: "Badini", password: "Wave@1302" },
  { name: "Helin Qaisar Arf", email: "helin.qaisar@highperformanceco.net", wave_id: "1311", role: "agent", queue: "Badini", password: "Wave@1311" },
  { name: "Muhammad musa khanimi", email: "muhammad.musa@highperformanceco.net", wave_id: "1312", role: "agent", queue: "Badini", password: "Wave@1312" },
  { name: "Yusef Qubad Obaid", email: "yusef.qubad@highperformanceco.net", wave_id: "1313", role: "agent", queue: "Badini", password: "Wave@1313" },
  { name: "NORJAN dlshad abdullrahman", email: "norjan.dlshad@highperformanceco.net", wave_id: "1314", role: "agent", queue: "Badini", password: "Wave@1314" },
  { name: "Safeen Mahde Zebar", email: "safeen.mahde@highperformanceco.net", wave_id: "1315", role: "agent", queue: "Badini", password: "Wave@1315" },
  { name: "Zana Maqsod", email: "zana.maqsod@highperformanceco.net", wave_id: "1351", role: "agent", queue: "Badini", password: "Wave@1351" },
  { name: "Yousif farsat mohammad", email: "yousif.farsat@highperformanceco.net", wave_id: "1354", role: "agent", queue: "Badini", password: "Wave@1354" },
  { name: "Amar Kherullah", email: "amar.kherullah@highperformanceco.net", wave_id: "1243", role: "agent", queue: "Sorani", password: "Wave@1243" },
  { name: "Ahmed Rashad", email: "ahmed.rashad1@highperformanceco.net", wave_id: "1176", role: "agent", queue: "Sorani", password: "Wave@1176" },
  { name: "Ahmed Saman", email: "ahmed.saman@highperformanceco.net", wave_id: "1163", role: "agent", queue: "Sorani", password: "Wave@1163" },
  { name: "Awdang Saman", email: "awdang.saman@highperformanceco.net", wave_id: "1121", role: "agent", queue: "Sorani", password: "Wave@1121" },
  { name: "Barham Haider", email: "barham.haider@highperformanceco.net", wave_id: "1178", role: "agent", queue: "Sorani", password: "Wave@1178" },
  { name: "Gailan Xalid", email: "gailan.xalid@highperformanceco.net", wave_id: "1127", role: "agent", queue: "Sorani", password: "Wave@1127" },
  { name: "Govand Wali", email: "govand.wali@highperformanceco.net", wave_id: "1089", role: "agent", queue: "Sorani", password: "Wave@1089" },
  { name: "Haryad Shakr Abdulla", email: "haryad.abdulla1@highperformanceco.net", wave_id: "1170", role: "agent", queue: "Sorani", password: "Wave@1170" },
  { name: "Hawrin Amir Ahmed", email: "hawrin.ahmed@highperformanceco.net", wave_id: "1188", role: "agent", queue: "Sorani", password: "Wave@1188" },
  { name: "Israa Peshkawt", email: "israa.peshkawt@highperformanceco.net", wave_id: "1168", role: "agent", queue: "Sorani", password: "Wave@1168" },
  { name: "Karwan Wali", email: "karwan.wali@highperformanceco.net", wave_id: "1139", role: "agent", queue: "Sorani", password: "Wave@1139" },
  { name: "Lana Tahsin Maghdid", email: "lana.maghdid@highperformanceco.net", wave_id: "1190", role: "agent", queue: "Sorani", password: "Wave@1190" },
  { name: "Malik Rashid", email: "rashid.hasan@highperformanceco.net", wave_id: "1126", role: "agent", queue: "Sorani", password: "Wave@1126" },
  { name: "Mohammed Soran Hassan", email: "mohammed.hassan@highperformanceco.net", wave_id: "1184", role: "agent", queue: "Sorani", password: "Wave@1184" },
  { name: "Muhammad Ali Osman", email: "ali.osman@highperformanceco.net", wave_id: "1137", role: "agent", queue: "Sorani", password: "Wave@1137" },
  { name: "Mustafa Khudhur Ali", email: "mustafa.khudhur@highperformanceco.net", wave_id: "1107", role: "agent", queue: "Sorani", password: "Wave@1107" },
  { name: "Raman Salah Karim", email: "raman.karim@highperformanceco.net", wave_id: "1185", role: "agent", queue: "Sorani", password: "Wave@1185" },
  { name: "Rawaz Muhammed", email: "rawaz.muhammed1@highperformanceco.net", wave_id: "1179", role: "agent", queue: "Sorani", password: "Wave@1179" },
  { name: "Rayan Jaafar", email: "rayan.jaafar@highperformanceco.net", wave_id: "1119", role: "agent", queue: "Sorani", password: "Wave@1119" },
  { name: "Ronar Rasul", email: "ronar.rasul@highperformanceco.net", wave_id: "1180", role: "agent", queue: "Sorani", password: "Wave@1180" },
  { name: "Safeen Jahfar", email: "safeen.jahfar1@highperformanceco.net", wave_id: "1096", role: "agent", queue: "Sorani", password: "Wave@1096" },
  { name: "Sarmand Swara Kakakhan", email: "sarmand.swara1@highperformanceco.net", wave_id: "1106", role: "agent", queue: "Sorani", password: "Wave@1106" },
  { name: "Sazgar Hassan", email: "sazgar.hassan@highperformanceco.net", wave_id: "1117", role: "agent", queue: "Sorani", password: "Wave@1117" },
  { name: "Sozhin Karim", email: "sozhin.karim1@highperformanceco.net", wave_id: "1114", role: "agent", queue: "Sorani", password: "Wave@1114" },
  { name: "Srwd Shwan Hashim", email: "srwd.hashim@highperformanceco.net", wave_id: "1182", role: "agent", queue: "Sorani", password: "Wave@1182" },
  { name: "Yousif hussen Bahram", email: "yousif.bahram1@highperformanceco.net", wave_id: "1155", role: "agent", queue: "Sorani", password: "Wave@1155" },
  { name: "Yousif sherzad muhammed", email: "yousif.muhammed@highperformanceco.net", wave_id: "1156", role: "agent", queue: "Sorani", password: "Wave@1156" },
  { name: "Zhiya Najmadin", email: "zhiyar.najmadin@highperformanceco.net", wave_id: "1162", role: "agent", queue: "Sorani", password: "Wave@1162" },
  { name: "Zuher Anwer", email: "zuher.anwer@highperformanceco.net", wave_id: "1146", role: "agent", queue: "Sorani", password: "Wave@1146" },
  { name: "Shaida Faizan Kawiz", email: "shaida.Kawiz@highperformanceco.net", wave_id: "1198", role: "agent", queue: "Sorani", password: "Wave@1198" },
  { name: "Lawin Kosrat Saadi", email: "lawin.Saadi@highperformanceco.net", wave_id: "1199", role: "agent", queue: "Sorani", password: "Wave@1199" },
  { name: "Bawar Fazl Muhammad", email: "bawar.muhammad@highperformanceco.net", wave_id: "1203", role: "agent", queue: "Sorani", password: "Wave@1203" },
  { name: "Barham Qasim Ahmed", email: "barham.qasim@highperformanceco.net", wave_id: "1204", role: "agent", queue: "Sorani", password: "Wave@1204" },
  { name: "Ahmed Khafut Xdr", email: "ahmed.khafut1@highperformanceco.net", wave_id: "1206", role: "agent", queue: "Sorani", password: "Wave@1206" },
  { name: "Muhammed Abdulbari Majid", email: "muhammed.abdulbari@highperformanceco.net", wave_id: "1207", role: "agent", queue: "Sorani", password: "Wave@1207" },
  { name: "Esra sabah salim", email: "esra.sabah@highperformanceco.net", wave_id: "1212", role: "agent", queue: "Sorani", password: "Wave@1212" },
  { name: "Dana Ahmed Shawkat", email: "dana.ahmed@highperformanceco.net", wave_id: "1213", role: "agent", queue: "Sorani", password: "Wave@1213" },
  { name: "Karos Kamaran hussein", email: "karos.hussein@highperformanceco.net", wave_id: "1214", role: "agent", queue: "Sorani", password: "Wave@1214" },
  { name: "Nzar Mohammad smail", email: "nzar.smail@highperformanceco.net", wave_id: "1216", role: "agent", queue: "Sorani", password: "Wave@1216" },
  { name: "Rama Shorsh muhammed", email: "rama.muhammed@highperformanceco.net", wave_id: "1217", role: "agent", queue: "Sorani", password: "Wave@1217" },
  { name: "Ahmed Ismail Fathulla", email: "ahmed.fathulla@highperformanceco.net", wave_id: "1221", role: "agent", queue: "Sorani", password: "Wave@1221" },
  { name: "Hero Ayub omer", email: "hero.omer@highperformanceco.net", wave_id: "1222", role: "agent", queue: "Sorani", password: "Wave@1222" },
  { name: "Sherwan kaifihadi hadi", email: "sherwan.hadi@highperformanceco.net", wave_id: "1223", role: "agent", queue: "Sorani", password: "Wave@1223" },
  { name: "Hezha Nuri Ebrahim", email: "hezha.nuri@highperformanceco.net", wave_id: "1229", role: "agent", queue: "Sorani", password: "Wave@1229" },
  { name: "Suhail Subhi Salh", email: "suhail.subhi@highperformanceco.net", wave_id: "1230", role: "agent", queue: "Sorani", password: "Wave@1230" },
  { name: "Ahmed Muhammad Muhammed", email: "ahmed.muhammed@highperformanceco.net", wave_id: "1231", role: "agent", queue: "Sorani", password: "Wave@1231" },
  { name: "Yassin Nihal Salm", email: "yassin.nihal@highperformanceco.net", wave_id: "1232", role: "agent", queue: "Sorani", password: "Wave@1232" },
  { name: "Abdulsamad Nazm Hussein", email: "abdulsamad.nazm@highperformanceco.net", wave_id: "1234", role: "agent", queue: "Sorani", password: "Wave@1234" },
  { name: "Hema Dhahir Sofi", email: "hema.sofi@highperformanceco.net", wave_id: "1241", role: "agent", queue: "Sorani", password: "Wave@1241" },
  { name: "Ibrahim Rashid", email: "ibrahim.rashid@highperformanceco.net", wave_id: "1242", role: "agent", queue: "Sorani", password: "Wave@1242" },
  { name: "Rebar Mohmmad", email: "rebar.mohmmad@highperformanceco.net", wave_id: "1244", role: "agent", queue: "Sorani", password: "Wave@1244" },
  { name: "Hussen Sangar Hussen", email: "hussen.sangar@highperformanceco.net", wave_id: "1245", role: "agent", queue: "Sorani", password: "Wave@1245" },
  { name: "Dabin Ismail Abdulrahman", email: "dabin.ismail@highperformanceco.net", wave_id: "1247", role: "agent", queue: "Sorani", password: "Wave@1247" },
  { name: "Lavan Abbas Noori", email: "lavan.noori@highperformanceco.net", wave_id: "1248", role: "agent", queue: "Sorani", password: "Wave@1248" },
  { name: "Brwa Kawa Majid", email: "brwa.majid@highperformanceco.net", wave_id: "1252", role: "agent", queue: "Sorani", password: "Wave@1252" },
  { name: "Meer Ali Kadhim", email: "meer.ali@highperformanceco.net", wave_id: "1254", role: "agent", queue: "Sorani", password: "Wave@1254" },
  { name: "Nihad Abdulmajid", email: "nihad.abdulmajid@highperformanceco.net", wave_id: "1255", role: "agent", queue: "Sorani", password: "Wave@1255" },
  { name: "Omer yaqub shina", email: "omer.shina@highperformanceco.net", wave_id: "1259", role: "agent", queue: "Sorani", password: "Wave@1259" },
  { name: "Sivar jawher ahmed", email: "sivar.ahmed@highperformanceco.net", wave_id: "1260", role: "agent", queue: "Sorani", password: "Wave@1260" },
  { name: "IBRAHIM AZAD RADHA", email: "ibrahim.radha@highperformanceco.net", wave_id: "1261", role: "agent", queue: "Sorani", password: "Wave@1261" },
  { name: "abdulmoamein walid hamad", email: "abdulmoamein.hamad@highperformanceco.net", wave_id: "1263", role: "agent", queue: "Sorani", password: "Wave@1263" },
  { name: "karwan musheer abdulqadir", email: "karwan.abdulqadir@highperformanceco.net", wave_id: "1264", role: "agent", queue: "Sorani", password: "Wave@1264" },
  { name: "bexal ibrahim ali", email: "bexal.ali@highperformanceco.net", wave_id: "1266", role: "agent", queue: "Sorani", password: "Wave@1266" },
  { name: "Sina Sami Qadir", email: "sina.sami@highperformanceco.net", wave_id: "1133", role: "agent", queue: "Sorani", password: "Wave@1133" },
  { name: "Muhammad Bahram Ahmed", email: "bahram.ahmed@highperformanceco.net", wave_id: "1140", role: "agent", queue: "Sorani", password: "Wave@1140" },
  { name: "Ahmed Alaa Ezzadein", email: "ahmed.alaa@highperformanceco.net", wave_id: "1142", role: "agent", queue: "Sorani", password: "Wave@1142" },
  { name: "Dlnia Jalal Muhammad", email: "dlnia.jalal@highperformanceco.net", wave_id: "1144", role: "agent", queue: "Sorani", password: "Wave@1144" },
  { name: "Lade Rawand Ismail", email: "lade.ismail@highperformanceco.net", wave_id: "1154", role: "agent", queue: "Sorani", password: "Wave@1154" },
  { name: "AishaKhan Saifaldin Kaifi", email: "aisha.kaifi@highperformanceco.net", wave_id: "1160", role: "agent", queue: "Sorani", password: "Wave@1160" },
  { name: "Mashxal Halmat jamal", email: "mashxal.jamal@highperformanceco.net", wave_id: "1161", role: "agent", queue: "Sorani", password: "Wave@1161" },
  { name: "Sara Hashm Abdulrahman", email: "sara.hashm@highperformanceco.net", wave_id: "1211", role: "agent", queue: "Sorani", password: "Wave@1211" },
  { name: "Shayma Muhammed abdulxalq", email: "shayma.muhammed@highperformanceco.net", wave_id: "1219", role: "agent", queue: "Sorani", password: "Wave@1219" },
  { name: "Zilan Sadeeq Abdullah", email: "zilan.sadeeq@highperformanceco.net", wave_id: "1235", role: "agent", queue: "Sorani", password: "Wave@1235" },
  { name: "Hanan Othman Sdiq", email: "hanan.othman@highperformanceco.net", wave_id: "1239", role: "agent", queue: "Sorani", password: "Wave@1239" },
  { name: "Madina Sami Anwar", email: "madina.sami@highperformanceco.net", wave_id: "1202", role: "agent", queue: "Sorani", password: "Wave@1202" },
  { name: "Mansour Dlshad maxdid", email: "mansour.dlshad@highperformanceco.net", wave_id: "1224", role: "agent", queue: "Sorani", password: "Wave@1224" },
  { name: "Balen ali ahmed", email: "balen.ali@highperformanceco.net", wave_id: "1236", role: "agent", queue: "Sorani", password: "Wave@1236" },
  { name: "Brusk Salar Mohammed", email: "brusk.salar@highperformanceco.net", wave_id: "1237", role: "agent", queue: "Sorani", password: "Wave@1237" },
  { name: "Mohammed Muzafar mohammed", email: "mohammed.muzafar@highperformanceco.net", wave_id: "1250", role: "agent", queue: "Sorani", password: "Wave@1250" },
  { name: "Ayub Saeed Qadir", email: "ayub.saeed@highperformanceco.net", wave_id: "1269", role: "agent", queue: "Sorani", password: "Wave@1269" },
  { name: "mustafa abdulaziz mustafa", email: "mustafa.abdulaziz@highperformanceco.net", wave_id: "1195", role: "agent", queue: "Sorani", password: "Wave@1195" },
  { name: "Ibrahim Hamza xdr", email: "ibrahim.hamza@highperformanceco.net", wave_id: "1281", role: "agent", queue: "Sorani", password: "Wave@1281" },
  { name: "Rebaz Raoof Mohammed", email: "rebaz.raoof@highperformanceco.net", wave_id: "1283", role: "agent", queue: "Sorani", password: "Wave@1283" },
  { name: "Muhamad Hamid majid", email: "muhamad.hamid@highperformanceco.net", wave_id: "1285", role: "agent", queue: "Sorani", password: "Wave@1285" },
  { name: "Jihad Ayoub hamid", email: "jihad.ayoub@highperformanceco.net", wave_id: "1286", role: "agent", queue: "Sorani", password: "Wave@1286" },
  { name: "Diyar Fouad Hameed", email: "diyar.fouad@highperformanceco.net", wave_id: "1287", role: "agent", queue: "Sorani", password: "Wave@1287" },
  { name: "Aland ismail ahmad", email: "aland.ismail@highperformanceco.net", wave_id: "1289", role: "agent", queue: "Sorani", password: "Wave@1289" },
  { name: "Noora yasin", email: "noora.yasin@highperformanceco.net", wave_id: "1291", role: "agent", queue: "Sorani", password: "Wave@1291" },
  { name: "Arkan Sherko", email: "arkan.sherko@highperformanceco.net", wave_id: "1303", role: "agent", queue: "Sorani", password: "Wave@1303" },
  { name: "Hassan Mouyad muhammed", email: "hassan.mouyad@highperformanceco.net", wave_id: "1305", role: "agent", queue: "Sorani", password: "Wave@1305" },
  { name: "ibrahim najmadin osman", email: "Ibrahim.najmadin@highperformanceco.net", wave_id: "1306", role: "agent", queue: "Sorani", password: "Wave@1306" },
  { name: "Muhammed hiwa aziz", email: "muhammed.hiwa@highperformanceco.net", wave_id: "1307", role: "agent", queue: "Sorani", password: "Wave@1307" },
  { name: "Muhamad falah muhamad", email: "muhamad.falah@highperformanceco.net", wave_id: "1308", role: "agent", queue: "Sorani", password: "Wave@1308" },
  { name: "Mardin Halmat Jamal", email: "mardin.halmat@highperformanceco.net", wave_id: "1309", role: "agent", queue: "Sorani", password: "Wave@1309" },
  { name: "Mazn Tahseen Aziz", email: "mazn.tahseen@highperformanceco.net", wave_id: "1310", role: "agent", queue: "Sorani", password: "Wave@1310" },
  { name: "Sivar Farman Samad", email: "sivar.farman@highperformanceco.net", wave_id: "1339", role: "agent", queue: "Sorani", password: "Wave@1339" },
  { name: "Yahya Salm", email: "yahya.salm@highperformanceco.net", wave_id: "1340", role: "agent", queue: "Sorani", password: "Wave@1340" },
  { name: "Dlovan Naif Hamadamin", email: "dlovan.naif@highperformanceco.net", wave_id: "1343", role: "agent", queue: "Sorani", password: "Wave@1343" },
  { name: "Mohammed Khorshed", email: "mohammed.khorshed@highperformanceco.net", wave_id: "1344", role: "agent", queue: "Sorani", password: "Wave@1344" },
  { name: "Zardarasht Iskander", email: "zardarasht.iskander@highperformanceco.net", wave_id: "1346", role: "agent", queue: "Sorani", password: "Wave@1346" },
  { name: "Yousuf Omer Sherzad", email: "yousuf.omer@highperformanceco.net", wave_id: "1347", role: "agent", queue: "Sorani", password: "Wave@1347" },
  { name: "Akam Sherzad hamad", email: "akam.sherzad@highperformanceco.net", wave_id: "1348", role: "agent", queue: "Sorani", password: "Wave@1348" },
  { name: "Blind hersh", email: "blind.hersh@highperformanceco.net", wave_id: "1353", role: "agent", queue: "Sorani", password: "Wave@1353" },
  { name: "Diyar sattar abduljabar", email: "diyar.sattar@highperformanceco.net", wave_id: "1356", role: "agent", queue: "Sorani", password: "Wave@1356" },
  { name: "Hawnaz Hewa Hashimm", email: "hawnaz.hewa@highperformanceco.net", wave_id: "1350", role: "agent", queue: "Sorani", password: "Wave@1350" },
  { name: "Helen Abdulwahid Qadir", email: "helen.abdulwahid@highperformanceco.net", wave_id: "1352", role: "agent", queue: "Sorani", password: "Wave@1352" }
];

async function seedUsers() {
  try {
    let created = 0, skipped = 0;
    for (const u of users) {
      const exists = await pool.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (exists.rows.length > 0) { skipped++; continue; }
      const hash = await bcrypt.hash(u.password, 10);
      await pool.query(
  `
  INSERT INTO users (
    name,
    email,
    wave_id,
    password,
    role
  )
  VALUES ($1,$2,$3,$4,$5)
  `,
  [
    u.name,
    u.email,
    u.wave_id,
    hash,
    u.role
  ]
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