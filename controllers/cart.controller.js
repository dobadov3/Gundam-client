var data = require('../layout.data')
var Product = require('../models/products.model');
var Account = require('../models/account.model');
var Cart = require('../models/cart.model')
const axios = require('axios');
var listCity = [];

module.exports.get = async function(req, res) {
    console.log(res.locals.finalPrice, req.session.cart);
    var currentUser = await Account.findOne({
        _id: req.signedCookies.userID,
    });
    var delivery_address = []
    var products = []
    if (req.session.cart){
        products = req.session.cart.products;
    }

    if(currentUser){
        delivery_address = currentUser.delivery_address;
    }

    res.render('./cart/index', {
        data: data.data,
        products,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice,
        delivery_address
    });
}

module.exports.removeCart = async function(req, res) {
    var productID = req.params.productID;

    var product = await Product.findById(productID);

    var products = [...req.session.cart.products];

    req.session.cart.products.forEach(item => {
        if (product._id.equals(item._id)){
            var index = req.session.cart.products.indexOf(item);
            products.splice(index, 1);
            req.session.cart.products = products;
            req.session.cart.totalPrice -= item.priceSale;
        }
    });

    res.locals.finalPrice = 0;

    Cart.removeCart();
    res.redirect('back')
}