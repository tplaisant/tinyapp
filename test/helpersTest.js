const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');
const { users } = require('../express_server.js');

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