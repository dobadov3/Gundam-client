var Product = require('../../models/products.model');
module.exports.get = async function(req, res){
    var product =await Product.find().sort({_id:-1}).limit(5)
    res.json(product);
}
