var Order = require('../../models/order.model');

module.exports.get = async function(req, res){
    var order = await Order.find();
    res.json(order);
}
