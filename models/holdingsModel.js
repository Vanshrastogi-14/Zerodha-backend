const {model} = require('mongoose');
const {holdingsSchema} = require('../schemas/holdingsSchema');

const Holding = new model("Holding",holdingsSchema);

module.exports = {Holding};