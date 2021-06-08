var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    id_detail_category: String,
    name: String,
    price: Number,
    count: Number,
    description: Array,
    image: Array,
    sale: Number,
    weight: Number,
    quantity: Number,
    priceSale: Number,
    rating: Array,
    rating_point: Number,
});

var Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;