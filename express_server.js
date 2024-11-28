const { generateRandomString, getUserByEmail, checkPass, retrieveID, findShortURL, urlsForUser } = require("./helpers.js");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const PORT = 8080; // default port 8080
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'user_id',
  keys: [ 'dieueyf7huienejnfef', 'lkjdhalkdwblsdw' ]
}));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  dnx9l: {
    id: 'dnx9l',
    email: 'tiago@tiago',
    password: '$2a$10$E3wn03/yqqABgtaYQCMp.e7zlnALkliPzDVwcJLdY9XT0PRiJDJ2e'
  },
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userId: "userRandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userId: "123",
  },
  sgq3y6: {
    longURL: "https://www.9gag.com",
    userId: "dnx9l",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = { 
    urls: urlsForUser(user.id, urlDatabase),
    user,
  };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const user = users[req.session.user_id];
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
  const user = users[req.session.user_id];
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
  const user = users[req.session.user_id];
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
  const user = users[req.session.user_id];
  const templateVars = {
    user,
  };
  res.redirect(longURL, templateVars);
});

app.get("/urls/:id", (req, res) => {
  const user = users[req.session.user_id];
  let owner = false;

    if (user.id === urlDatabase[req.params.id].userId) {
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
        id,
        email,
        password,
    }
    if (getUserByEmail(email, users)) {
      res.status(400).send('Email already in use');
    } else {
      users[id] = newUser;
      req.session.user_id = id;
      res.redirect('/urls');
    }
  }
});

app.post("/urls", (req, res) => {
  const newURL = generateRandomString();
  const user = users[req.session.user_id];
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
  const user = users[req.session.user_id];

  if (user.id === urlDatabase[req.params.id].userId) {   
    delete urlDatabase[req.params.id];    
    res.redirect(`/urls`);
  } else {
    res.status(403).send('Only the owner may edit/delete the URL');
  }    
});

app.post("/urls/:id", (req, res) => {
  const user = users[req.session.user_id];
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

  if (getUserByEmail(email, users)) {
    if (checkPass(email, password, users)) {
      req.session.user_id = retrieveID(email, users);
      res.redirect(`/urls`);
    } else {
      res.status(403).send('Password does not match');  
    }   
  } else {
    res.status(403).send('Email not found');
  };  
})

app.post("/logout", (req, res) => {
  req.session['user_id'] = null;
  res.redirect(`/login`);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports =  { users };