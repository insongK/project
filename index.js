const express = require("express");
const mysql = require("mysql");
const dbconfig = require("./config/database.js");
const bodyparser = require("body-parser");
const connection = mysql.createConnection(dbconfig);

const app = express();

// configuration =========================
app.set("port", process.env.PORT || 3000);

app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send("Root");
});

app.get("/users", (req, res) => {
  connection.query("SELECT * from users", (error, rows) => {
    if (error) throw error;
    console.log("User info is: ", rows);
    res.send(rows);
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // 여기서는 간단한 예제로 사용자를 users 테이블에 저장합니다.
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  connection.query(sql, [name, email, password], (err, results) => {
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
