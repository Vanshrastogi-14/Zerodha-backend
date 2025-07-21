const {model} = require('mongoose');
const {ordersSchema} = require('../schemas/ordersSchema');

const Order = new model("Order",ordersSchema);

module.exports = {Order};