const bcrypt = require("bcryptjs");

urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "123",
  },
  sgq3y6: {
    longURL: "https://www.9gag.com",
    userID: "dnx9l",
  },
};

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

const checkPass = (email, password) => {
  for (const key of Object.keys(users)) {
    if (users[key].email === email) { // Checking if email matches the DB
      if (bcrypt.compareSync(password, users[key].password)) { // Checking if password matches the DB
        return true;            
      }
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

module.exports =  { users, urlDatabase, generateRandomString, findUser, checkPass, retrieveID, findShortURL, urlsForUser };