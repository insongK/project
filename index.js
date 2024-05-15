const express = require("express");
const mysql = require("mysql");
const dbconfig = require("./config/database.js");
const connection = mysql.createConnection(dbconfig);

const app = express();

// configuration =========================
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.send("Root");
});

app.get("/users", (req, res) => {
  connection.query("SELECT * from Users", (error, rows) => {
    if (error) throw error;
    console.log("User info is: ", rows);
    res.send(rows);
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 여기서는 간단한 예제로 사용자를 users 테이블에 저장합니다.
  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Error saving user data to MySQL: " + err.stack);
      res.status(500).send("Error saving user data to MySQL");
      return;
    }
    console.log("User data saved to MySQL");
    res.send("User data saved to MySQL");
  });
});

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
