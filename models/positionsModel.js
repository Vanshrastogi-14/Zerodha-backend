const {model} = require('mongoose');
const {positionsSchema} = require('../schemas/positionsSchema');

const Position = new model("Position",positionsSchema);

module.exports = {Position};