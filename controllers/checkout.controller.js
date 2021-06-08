var data = require('../layout.data')
var Account = require('../models/account.model');
var DeliveryMethod = require('../models/delivery_method.model');
var PaymentMethod = require('../models/payment_method.model');

module.exports.get = async function(req, res){
    if(!res.locals.checkLogin){
        res.redirect('/authentication');
        return;
    }
    if(req.query.delivery_address){
        var index = req.query.delivery_address;
        var currentUser = await Account.findOne({ _id: req.signedCookies.userID });
        var delivery_method = await DeliveryMethod.find();
        var payment_method = await PaymentMethod.find();
        var delivery_address = currentUser.delivery_address[index];
        var delivery = delivery_address.address;
    
        res.render('./checkout/index', {
            delivery,
            index,
            currentUser,
            delivery_method,
            payment_method
        });
    }else{
        var currentUser = await Account.findOne({
            _id: req.signedCookies.userID,
        });
        var {city, district, address} = req.query;
        var delivery_method = await DeliveryMethod.find();
        var payment_method = await PaymentMethod.find();
        var delivery = `${address} ${district} ${city}`;
        res.render("./checkout/index", {
            delivery,
            delivery_method,
            payment_method,
            currentUser
        });
    }
}