var data = require('../layout.data');
var Product = require('../models/products.model');
var Category = require('../models/category.model');
var DetailCategory = require('../models/detail_category.model');
var Cart = require('../models/cart.model');
var Wishlist = require('../models/wishlist.model');
const Account = require('../models/account.model');

module.exports.get = function(req, res) {

}

var AdjustProductsPriceSale = function(products) {
    products.forEach(product => {
        product.priceSale = product.price - (product.price * product.sale) / 100;
    });
}

module.exports.getByCategory = async function(req, res) {
    var cateID = req.params.cateID;
    var page = req.query.page || 1;
    var limit = 12;


    var totalProducts = await Product.find({ id_detail_category: cateID });

    var maxPage = Math.floor(totalProducts.length / limit)

    if ((totalProducts.length % limit) !== 0) {
        ++maxPage;
    }

    var count = await (await Product.find({ id_detail_category: cateID })).length;

    res.render("./products/index", {
        data: data.data,
        page: parseInt(page),
        limit: parseInt(limit),
        countItems: parseInt(count),
        cateID,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice,
        maxPage,
    });
};

module.exports.getSort = async function(req, res){
    var cateID = req.params.cateID;
    var page = req.query.page || 1;
    var limit = 12;

    var totalProducts = await Product.find({ id_detail_category: cateID });
    var products;

    switch(req.params.sort){
        case "sortLowestFirst":
            products = await Product.find({ id_detail_category: cateID })
                .skip(page * limit - limit)
                .limit(limit)
                .sort({price: 1});
            break;
        case "sortHighestFirst":
            products = await Product.find({ id_detail_category: cateID })
                .skip(page * limit - limit)
                .limit(limit)
                .sort({ price: -1 });
            break;
        case "sortByName":
            products = await Product.find({ id_detail_category: cateID })
                .skip(page * limit - limit)
                .limit(limit)
                .sort({ name: -1 });
            break;
        default:
            break;
    }

    AdjustProductsPriceSale(products);

    var maxPage = Math.floor(totalProducts.length / limit);

    if (totalProducts.length % limit !== 0) {
        ++maxPage;
    }

    var count = await (
        await Product.find({ id_detail_category: cateID })
    ).length;

    res.render("./products/index", {
        data: data.data,
        products: products,
        page: parseInt(page),
        limit: parseInt(limit),
        items: products.length / limit,
        countItems: parseInt(count),
        cateID,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice,
        maxPage,
        cateID,
    });
}

module.exports.getCategory = async function(req, res) {
    var page = req.query.page || 1;
    var cateName = req.params.cateName;
    var limit = 8;

    var category = await Category.findOne({ name: cateName });

    var detail_category = await DetailCategory.find({ id_category: category._id })

    var list_id_detail = detail_category.map(function(cate) {
        return cate._id;
    });

    var products = await Product.find({ id_detail_category: { "$in": list_id_detail } })
        .skip((page * limit) - limit)
        .limit(limit);

    AdjustProductsPriceSale(products)

    var count = await (await Product.find({ id_detail_category: { "$in": list_id_detail } })).length;

    res.render('./products/index', {
        data: data.data,
        products: products,
        page: parseInt(page),
        limit: parseInt(limit),
        items: (products.length) / limit,
        countItems: parseInt(count),
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice
    });
};

module.exports.getDetail = async function(req, res) {
    var id = req.params.productID;
    
    var product = await Product.findById(id);

    product.priceSale = product.price - (product.price * product.sale) / 100;

    var relatedProducts = await Product.find({ id_detail_category: product.id_detail_category }).limit(6);

    AdjustProductsPriceSale(relatedProducts)

    for (let index = 0; index < product.rating.length; index++) {
        var account = await Account.findById(product.rating[index].account_id)

        product.rating[index].nameCus = account ? account.name : "Unknow";
        setDateCreate(product.rating[index])
    }

    res.render('./products/detail_products', {
        data: data.data,
        product,
        relatedProducts,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice
    })
};

var setDateCreate = function (order) {
    var m = order.date.getMonth() + 1;
    var d = order.date.getDate();
    var y = order.date.getFullYear();
    order.date_create = d + "/" + m + "/" + y;
};

module.exports.addToCart = async function(req, res) {
    var productID = req.params.productID;
    
    var product = await Product.findOne({_id: productID});
    product.priceSale = product.price - (product.price * product.sale) / 100;

    Cart.add(product);
    req.session.cart = Cart.getCart();

    res.redirect('back');
};

module.exports.addToWishList = async function(req, res) {
    if (!req.signedCookies.userID) {
        res.redirect("/authentication");
        return;
    }
    
    var productID = req.params.productID;
    var currentAccount = await Account.findById(res.locals.currentAccount._id);

    
    var product = await Product.findOne({_id: productID});

    Wishlist.add(product);

    currentAccount.wishList = Wishlist.getWishlist().products;
    currentAccount.markModified('wishList')
    await currentAccount.save();

    res.redirect('back');
};

module.exports.search = async function(req, res) {
    var productName = req.query.product;
    var limit = 12;

    var totalProducts = await Product.find({ name: {$regex: productName} });

    var maxPage = Math.floor(totalProducts.length / limit);

    if (totalProducts.length % limit !== 0) {
        ++maxPage;
    }

    res.render('./products/search', {
        data: data.data,
        productName,
        maxPage,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice
    })
}