var homeRoute = require('./home.route');
var productsRoute = require('./products.route');
var wishlistRoute = require('./wishlist.route');
var cartRoute = require('./cart.route');
var authenticationRoute = require('./authentication.route');
var checkoutRoute = require('./checkout.route');
var orderRoute = require('./order.route');
var accountRoute = require('./account.route');

var categoryAPI = require('../api/routes/category.route');
var categoryDetailAPI = require('../api/routes/category-detail.route');
var citiesAPI = require('../api/routes/cities.route');
var accountAPI = require('../api/routes/account.route');
var orderAPI = require('../api/routes/order.route')
var productAPI = require('../api/routes/product.route')
var bestsellerAPI = require('../api/routes/bestseller.route')
var saleAPI = require('../api/routes/saleproduct.route')
var newApi = require('../api/routes/newproduct.route')
var searchApi = require('../api/routes/search.route')

var route = function(app){
    app.use('/home', homeRoute);
    app.use('/products', productsRoute);
    app.use('/wishlist', wishlistRoute);
    app.use('/cart', cartRoute);
    app.use('/authentication', authenticationRoute);
    app.use('/checkout',  checkoutRoute);
    app.use('/order',  orderRoute);
    app.use('/account', accountRoute);

    //api
    app.use('/api', categoryAPI);
    app.use('/api', categoryDetailAPI);
    app.use('/api', citiesAPI);
    app.use("/api", accountAPI);
    app.use('/api/orders',orderAPI);
    app.use('/api/products',productAPI)
    app.use('/api/bestseller',bestsellerAPI)
    app.use('/api/sale',saleAPI)
    app.use('/api/new',newApi)
    app.use("/api/search", searchApi);
}

module.exports = route;