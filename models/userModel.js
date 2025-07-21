const {model} = require('mongoose');
const {userSchema} = require('../schemas/userSchema');

const User = new model("User",userSchema);

module.exports = {User};