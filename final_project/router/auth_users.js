const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const foundUser = users.filter((user) => user.username == username);
  return foundUser.length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  for (let user of users) {
    if (user.username == username && user.password == password) return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (isValid(username)) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        "access",
        { expiresIn: 60 * 60 }
      );
      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).json({ message: "User logged in successfully" });
    }
    return res.status(400).json({ message: "Invalid Username / password" });
  }
  return res.status(404).json({ message: "User not registered" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn =req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  
  books[isbn].reviews[username]= review;

  return res.send("Review added successfully");
});

//Delete a book review
regd_users.delete("/auth/review/:isbn" , (req,res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  
  delete books[isbn].reviews[username];
  res.status(200).send("Review deleted successfully");
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
