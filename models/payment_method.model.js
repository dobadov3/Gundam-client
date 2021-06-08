var mongoose = require('mongoose');

var paymentMethodSchema = new mongoose.Schema({
    name: String,
    content: String,
    description: String
});

var PaymentMethodSchema = mongoose.model('PaymentMethod', paymentMethodSchema, 'payment_method');

module.exports = PaymentMethodSchema;