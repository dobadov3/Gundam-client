var mongoose = require('mongoose');

var deliveryMethodSchema = new mongoose.Schema({
    name: String,
    content: String,
    cost: Number
});

var DeliveryMethodSchema = mongoose.model('DeliveryMethod', deliveryMethodSchema, 'delivery_method');

module.exports = DeliveryMethodSchema;