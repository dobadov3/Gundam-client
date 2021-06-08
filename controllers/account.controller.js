const Account = require('../models/account.model');
const Order = require('../models/order.model');
const DeliveryMethod = require('../models/delivery_method.model');
const md5 = require('md5');
const Product = require('../models/products.model');

module.exports.getProfile = async function(req, res){
    res.render('./account/profile', {
        currentAccount: res.locals.currentAccount
    })
}

module.exports.getChangePass = async function(req, res){
    res.render('./account/password')
}

module.exports.postChangePass = async function(req, res){
    var currentAccount = await Account.findById(res.locals.currentAccount._id);
    var old_pass = md5(req.body.old_pass)
    var new_pass = md5(req.body.new_pass)

    if(req.body.confirm_newPass !== req.body.new_pass){
        res.render("./account/password", {
            error: "Mật khẩu xác nhận không đúng!"
        });
        return
    }

    if (old_pass !== currentAccount.password) {
        res.render("./account/password", {
            error: "Mật khẩu cũ không đúng!",
        });
        return;
    }
    console.log(currentAccount.password);
    currentAccount.password = new_pass;
    currentAccount.save();
    console.log(currentAccount.password);

    res.redirect('back')
}

module.exports.getHistory = async function (req, res) {
    var {order_id} = req.query;
    var {from_date} = req.query;
    var {to_date} = req.query;

    console.log(from_date, to_date)
    
    if (!order_id && !from_date && !to_date){
        var orders = await Order.find({id_account: res.locals.currentAccount._id});
        orders.forEach(item => {
            setDateCreate(item)
        })
        res.render("./account/history", {
            currentAccount: res.locals.currentAccount,
            orders
        });
    }else if (order_id && !from_date && !to_date) {
        var orders = await Order.find({
            id_account: res.locals.currentAccount._id,
            code: order_id,
        });
        orders.forEach((item) => {
            setDateCreate(item);
        });
        res.render("./account/history", {
            currentAccount: res.locals.currentAccount,
            orders,
        });
    }else if (!order_id && from_date && to_date){
        console.log(new Date(from_date), new Date(to_date));

        var orders = await Order.find({
            date: {
                $gte: new Date(from_date),
                $lt: new Date(to_date)
            },
        });
        orders.forEach((item) => {
            setDateCreate(item);
        });
        res.render("./account/history", {
            currentAccount: res.locals.currentAccount,
            orders,
        });
    }else if (order_id && from_date && to_date) {
        var orders = await Order.find({
            id_account: res.locals.currentAccount._id,
            code: order_id,
        });
        orders.forEach((item) => {
            setDateCreate(item);
        });
        res.render("./account/history", {
            currentAccount: res.locals.currentAccount,
            orders,
        });
    }
};

module.exports.getDetailHistory = async function(req, res){
    var orders = await Order.findById(req.params.orderID);
    var delevery_method = await DeliveryMethod.findById(orders.delivery_method);

    orders.ship_cost = delevery_method.cost;
    orders.temp = 0;

    orders.products.forEach(product => {
        orders.temp += product.priceSale;
    })

    setDateCreate(orders)

    res.render("./account/detail-history", {
        currentAccount: res.locals.currentAccount,
        orders,
    });
}

module.exports.postProfile = async function(req, res){
    var currentAccount = await Account.findById(res.locals.currentAccount._id);
    currentAccount.email = req.body.email;
    currentAccount.username = req.body.username;
    currentAccount.name = req.body.name;
    currentAccount.phone = req.body.phone;
    currentAccount.cmnd = req.body.cmnd;
    currentAccount.gender = req.body.gender;
    currentAccount.job = req.body.job;


    if (currentAccount.delivery_address[0].phone === ''){
        currentAccount.delivery_address[0].phone = req.body.phone;
    }

    currentAccount.markModified("delivery_address");
    currentAccount.save();

    res.redirect('back');
}

module.exports.postAddNewAddress = async function(req, res){
    if (!res.locals.currentAccount){
        res.redirect("/authentication");
        return
    }
    const {name, phone, district, address, city} = req.body
    var currentAccount = await Account.findById(res.locals.currentAccount._id);
    
    var obj = {
        name: name,
        phone: phone,
        address: `${address} ${district} ${city}`
    }

    currentAccount.delivery_address.push(obj);
    currentAccount.markModified("delivery_address");
    currentAccount.save();

    res.redirect('back')
}

var setDateCreate = function (order) {
    var m = order.date.getMonth() + 1;
    var d = order.date.getDate();
    var y = order.date.getFullYear();
    order.date_create = d + "/" + m + "/" + y;
};

module.exports.postRating = async function(req,res){
    var obj = {
        account_id: res.locals.currentAccount._id,
        message: req.body.message,
        point: parseInt(req.body.point),
        date: new Date()
    };

    var product = await Product.findById(req.params.productID);
    product.rating.push(obj);

    if (product.rating_point){
        var totalPoint = 0;

        product.rating.forEach(item => {
            totalPoint += item.point
        })

        product.rating_point = Math.round(totalPoint/product.rating.length)

    }else{
        product.rating_point = obj.point;
    }

    product.markModified('rating')
    product.save();

    res.redirect('back')
}

