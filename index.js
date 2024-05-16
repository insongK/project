const express = require("express");
const mysql = require("mysql");
const dbconfig = require("./config/database.js");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const connection = mysql.createConnection(dbconfig);

const app = express();

// configuration =========================
app.set("port", process.env.PORT || 3000);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const saltRounds = 10;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      connection.query(sql, [name, email, hash], (err, results) => {
        if (err) {
          console.error("Error saving user data to MySQL: " + err.stack);
          res.status(500).send("Error saving user data to MySQL");
          return;
        }
        console.log("User data saved to MySQL");
        res.send("User data saved to MySQL");
      });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT email,password FROM users WHERE email = ?";
  connection.query(sql, email, (err, results) => {
    if (err) {
      console.error("존재하지 않는 데이터이다. " + err.stack);
      return;
    }

    // 사용자를 찾지 못한 경우
    if (results.length === 0) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const user = results[0];

    // bcrypt를 사용하여 사용자가 입력한 비밀번호와 데이터베이스에서 가져온 해시된 비밀번호를 비교합니다.
    bcrypt.compare(password, user.password, (bcryptError, bcryptResult) => {
      if (bcryptError) {
        console.error("Error comparing passwords:", bcryptError);
        res
          .status(500)
          .json({ error: "An error occurred while comparing passwords." });
        return;
      }

      // 비밀번호가 일치하는 경우
      if (bcryptResult) {
        res.status(200).json({ message: "Login successful." });
      } else {
        // 비밀번호가 일치하지 않는 경우
        res.status(401).json({ error: "Invalid email or password." });
      }
    });
  });
});

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
