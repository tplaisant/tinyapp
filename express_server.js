const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "123",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "123",
  },
  sgq3y6: {
    longURL: "https://www.9gag.com",
    userID: "123",
  },
};

const users = {
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
};

const generateRandomString = () => {
  return Math.random().toString(36).substring(2,5+2);
};

const findUser = (email) => {
  for (const key of Object.keys(users)) {
    if (users[key].email === email) { // Checking if email already exists in the DB
      return true;            
    }
  }
  return false;
}

const checkPass = (password) => {
  for (const key of Object.keys(users)) {
    if (users[key].password === password) { // Checking if password matches the DB
      return true;            
    }
  }
  return false;
}

const retrieveID = (email) => {
  for (const key of Object.keys(users)) {
    if (users[key].email === email) {
      return key;            
    }
  }
  return false;
}
  
const findShortURL = (shortURL) => {
  for (const key of Object.keys(urlDatabase)) {
    if (key === shortURL) { // Checking if short URL already exists in the DB
      return true;            
    }
  }
  return false;  
}

const urlsForUser = (id) => {
  let urls = {};
  
  for (const key of Object.keys(urlDatabase)) {
    if (urlDatabase[key].userID === id.id) {
      const url = {
          shortURL: key,
          longURL: urlDatabase[key].longURL,           
      }      
      urls[key] = url;            
    }
  }
  return urls;
}

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

  // if (findShortURL(req.params.id)) {
    res.render("urls_show", templateVars);
  // } else {
  //   //HTML ERROR MESSAGE
  // }  
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
    const password = req.body.password;

    const newUser = {
      [id]: {
        id,
        email,
        password,
      }
    }
    if (findUser(email)) {
      res.status(400).send('Email already in use');
    } else {
      users[id] = newUser;
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
  const templateVars = { 
    user,
  };
  console.log(user);
  console.log(urlDatabase[req.params.id].userID);

  if (user.id === urlDatabase[req.params.id].userID) {    
    console.log(urlDatabase);
    delete urlDatabase[req.params.id];
    console.log(urlDatabase);
  }
  
  res.redirect(`/urls`, templateVars);
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
    if (checkPass(password)) {      
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
