var data = require('../layout.data')
var Product = require('../models/products.model');
var Account = require('../models/account.model');
var Role = require('../models/role.model');
const md5 = require('md5');
const shortId = require('short-id');

module.exports.get = async function(req, res) {
    var products = await Product.find();

    facebook(req, res);

    products.forEach(product => {
        product.priceSale = product.price - (product.price * product.sale) / 100
    });

    var products = await Product.find();

    res.render('./home/index', {
        data: data.data,
        checkLogin: res.locals.checkLogin,
        products: products.slice(8, 14),
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice
    });
};

var facebook = async function(req, res){
    if (!req.session.passport){
        return
    }

    var user = req.session.passport.user;

    if (user){
        var account = await Account.findOne({
            email: user._json.email,
            type: "facebook"
        })

        if (!account){
            var obj = {
                name: user._json.name,
                phone: '',
                address: '',
            }

            var newAccount = new Account({
                username: user.id,
                name: user._json.name,
                email: user._json.email,
                password: md5(shortId.generate()),
                type: 'facebook'
            });

            newAccount.delivery_address.push(obj)

            Account.create(newAccount);
            res.cookie("userID", newAccount._id, {
                signed: true,
            });
            res.locals.checkLogin = true;
        }else{
            res.cookie("userID", account._id, {
                signed: true,
            });
            res.locals.checkLogin = true;
        }
    }
}


