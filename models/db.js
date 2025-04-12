const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "blogger_app",
});
connection.connect((err) => {
  if (err) throw err;
  console.log("connection is running");
});
module.exports = connection;
