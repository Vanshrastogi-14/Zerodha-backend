require('dotenv').config();

const jwt = require('jsonwebtoken');

const createSecretToken = (email)=>{
    return jwt.sign({ email:email }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

module.exports = {createSecretToken};