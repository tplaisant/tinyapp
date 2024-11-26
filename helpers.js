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

const generateRandomString = () => {
  return Math.random().toString(36).substring(2,5+2);
};

const getUserByEmail = (email, users) => {
  for (const key of Object.keys(users)) {
    if (users[key].email === email) { // Checking if email already exists in the DB
      return key;            
    }
  }
  return;
}

const checkPass = (email, password, users) => {
  for (const key of Object.keys(users)) {
    if (users[key].email === email) { // Checking if email matches the DB
      if (bcrypt.compareSync(password, users[key].password)) { // Checking if password matches the DB
        return true;            
      }
    }
  }
  return false;
}

const retrieveID = (email, users) => {
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

module.exports =  { urlDatabase, generateRandomString, getUserByEmail, checkPass, retrieveID, findShortURL, urlsForUser };