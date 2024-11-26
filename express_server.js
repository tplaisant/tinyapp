const { users, urlDatabase, generateRandomString, findUser, checkPass, retrieveID, findShortURL, urlsForUser } = require("./functions.js");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { 
    urls: urlsForUser(user),
    user,
  };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = {
    user,
  };
  if (user) {
    res.redirect('/urls');
  } else {
    res.render("register", templateVars);
  }  
});

app.get("/login", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = {
    user,
  };
  if (user) {
    res.redirect('/urls');
  } else {
    res.render("login", templateVars);
  }  
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = {
    user,
  };
  if (user) {
    res.render("urls_new", templateVars);
  } else {
    res.render("login", templateVars);
  }   
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  const user = users[req.cookies["user_id"]];
  const templateVars = {
    user,
  };
  res.redirect(longURL, templateVars);
});

app.get("/urls/:id", (req, res) => {
  const user = users[req.cookies["user_id"]];
  let owner = false;

  console.log(urlDatabase[req.params.id].userID);
    if (user.id === urlDatabase[req.params.id].userID) {
      owner = true;
    } else {
      owner = false;
    };

  const templateVars = { 
    id: req.params.id, 
    user,
    longURL: urlDatabase[req.params.id].longURL,
    owner: owner,
  };

    res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/register", (req, res) => {  
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Fill out both fields');
  } else {
    const id = generateRandomString();
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);

    const newUser = {
      // [id]: {
        id,
        email,
        password,
      // }
    }
    if (findUser(email)) {
      res.status(400).send('Email already in use');
    } else {
      console.log(users);
      users[id] = newUser;
      console.log(users);
      res.cookie('user_id', id);
      res.redirect('/urls');
    }
  }
});

app.post("/urls", (req, res) => {
  const newURL = generateRandomString();
  const user = users[req.cookies["user_id"]];
  const templateVars = { 
    user,
  };
  if (user) {
    urlDatabase[newURL] = req.body.longURL;
    res.redirect(`/urls/${newURL}`, templateVars);
  } else {
    res.render("login", templateVars);
  }    
});

app.post("/urls/:id/delete", (req, res) => {
  const user = users[req.cookies["user_id"]];

  if (user.id === urlDatabase[req.params.id].userID) {   
    delete urlDatabase[req.params.id];    
    res.redirect(`/urls`);
  } else {
    res.status(403).send('Only the owner may edit/delete the URL');
  }    
});

app.post("/urls/:id", (req, res) => {
  const user = users[req.cookies["user_id"]];
  urlDatabase[req.params.id] = req.body.newURL;
  const templateVars = { 
    id: req.params.id, 
    user,
    longURL: urlDatabase[req.params.id] 
  };
  res.render("urls_show", templateVars);
});

app.post("/login", (req, res) => {  
  const email = req.body.email;
  const password = req.body.password;

  if (findUser(email)) {
    if (checkPass(email, password)) {      
      res.cookie('user_id', retrieveID(email));
      res.redirect(`/urls`);
    } else {
      res.status(403).send('Password does not match');  
    }   
  } else {
    res.status(403).send('Email not found');
  };  
})

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/login`);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = { urlDatabase };