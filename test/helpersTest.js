const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');
const { users } = require('../express_server.js');
const { urlsForUser } = require('../helpers.js'); 

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", users)
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.strictEqual(user, expectedUserID); 
  });
  it('should return undefined due to non-valid email', function() {    
    const nonUser = getUserByEmail("user123@example.com", users)
    assert.strictEqual(nonUser, undefined); 
  });  
});

describe('urlsForUser', function() {
  it('should return urls that belong to the specified user', function() {
    // Define test data
    const urlDatabase1 = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user1" },
      "9sm5xK": { longURL: "http://www.google.com", userId: "user2" },
      "a1b2c3": { longURL: "http://www.example.com", userId: "user1" }
    };

    // Define expected output
    const expectedOutput = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user1" },
      "a1b2c3": { longURL: "http://www.example.com", userId: "user1" }
    };

    // Call the function with userId 'user1'
    const result = urlsForUser('user1', urlDatabase1);

    // Assert that the result matches the expected output
    assert.deepEqual(result, expectedOutput);
  });
});

describe('urlsForUser', function() {
  let urlDatabase;

  // Setup before each test
  beforeEach(function() {
    urlDatabase = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user1" },
      "9smXs7": { longURL: "http://www.google.com", userId: "user2" },
      "3zLkA5": { longURL: "http://www.example.com", userId: "user1" },
      "1q2tDs": { longURL: "http://www.test.com", userId: "user3" }
    };
  });

  it('should return urls that belong to the specified user', function() {
    const result = urlsForUser('user1', urlDatabase);
    const expected = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user1" },
      "3zLkA5": { longURL: "http://www.example.com", userId: "user1" }
    };
    assert.deepEqual(result, expected);
  });

  it('should return an empty object if the urlDatabase does not contain any urls for the specified user', function() {
    const result = urlsForUser('user4', urlDatabase);
    assert.deepEqual(result, {});
  });

  it('should return an empty object if the urlDatabase is empty', function() {
    const result = urlsForUser('user1', {});
    assert.deepEqual(result, {});
  });

  it('should not return urls that do not belong to the specified user', function() {
    const result = urlsForUser('user1', urlDatabase);
    assert.notProperty(result, '9smXs7'); // "9smXs7" is owned by "user2"
    assert.notProperty(result, '1q2tDs'); // "1q2tDs" is owned by "user3"
  });
});