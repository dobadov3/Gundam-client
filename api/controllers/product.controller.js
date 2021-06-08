var Product = require('../../models/products.model');

module.exports.get = async function(req, res){
    var cateID = req.params.cateID
    var page = req.params.page;
    var limit = 12;

    var products = await Product.find({ id_detail_category: cateID })
        .skip(page * limit - limit)
        .limit(limit);

    AdjustProductsPriceSale(products);

    res.json(products);
}

var AdjustProductsPriceSale = function (products) {
    products.forEach((product) => {
        product.priceSale =
            product.price - (product.price * product.sale) / 100;
    });
};

module.exports.sort = async function(req, res){
    var cateID = req.params.cateID
    var page = req.params.page;
    var limit = 12;
    var products;

        switch (req.params.sort) {
            case "sortLowestFirst":
                products = await Product.find({ id_detail_category: cateID })
                    .skip(page * limit - limit)
                    .limit(limit)
                    .sort({ price: 1 });
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

    res.json(products);
}

var AdjustProductsPriceSale = function (products) {
    products.forEach((product) => {
        product.priceSale =
            product.price - (product.price * product.sale) / 100;
    });
};