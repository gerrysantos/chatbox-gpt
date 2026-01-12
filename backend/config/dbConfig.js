import mysql from "mysql2";
import dotenv from "dotenv";

// MySQL 2nd Option
// export const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "k2-12-chatbox_db",
//   multipleStatements: true,
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("Connected...");
// });

dotenv.config();
// MySQL setup (my option)
export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) console.log("DB Connection Error:", err);
  else console.log("Connected to MySQL Database");
});
