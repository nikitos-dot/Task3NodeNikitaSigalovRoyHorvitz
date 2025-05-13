//Nikita Sigalov, Roy Horvitz 49-2

const db = require("../dbSingleton").getConnection();
const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

// Add a new user to the databse

router.post("/", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    //error that sends generally that something is missing
    return res
      .status(400)
      .json({ error: "Name(userName), email and password are required" });
  }
  //hashing the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err)
      return res.status(500).json({ error: "saving password went wrongs" });
    //inserting into the DB if everything is good
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, name, email });
      }
    );
  });
});

// Update the users password that exists in the data base

http: router.put("/:id", (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Missing password" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: "Error saving password" });

    db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, req.params.id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "Password updated" });
      }
    );
  });
});

// Login and ehcking thr password and email match ususally, that is what we use in logining in alot of websites
//ofcourse we can change the function we can consider different parameters, but for the exercise we rely on Email and passowrd

http: router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ error: "Invalid email or password" });
    }
    //comparing inserted password to the hashed saved inside the Database
    bcrypt.compare(password, results[0].password, (err, match) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Issue with the password varify" });
      if (match) {
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    });
  });
});

module.exports = router;
