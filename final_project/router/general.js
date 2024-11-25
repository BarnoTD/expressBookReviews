const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){
    if (!isValid(username)){
      users.push({username:username, password: password})
      return res.status(200).json({message: "User registered successfully"});
    }
    return res.status(400).json({message : "Username already exists"})
  }
  res.status(400).json({message : "Username and or Password not provided"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn){
    return res.send(JSON.stringify(books[isbn],null,4));
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksFound = Object.values(books).filter((book)=>book.author == author);
  if (booksFound.length > 0) return res.send(JSON.stringify({booksFound},null,4));
  return res.status(404).send('No Books found');
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksFound = Object.values(books).filter((book)=>book.title == title);
  if (booksFound.length > 0) return res.send(JSON.stringify({booksFound},null,4));
  return res.status(404).send('No Books found');
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn){
    const review = books[isbn].reviews;
    if (review) return res.send(JSON.stringify(review,null,4));
    else res.status(404).send('No Book Found');
  }
  res.send("No ISBN provided");
});

module.exports.general = public_users;
