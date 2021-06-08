var Order = require('../models/order.model');
var Account = require('../models/account.model');
var DeliveryMethod = require('../models/delivery_method.model');
var PaymentMethod = require('../models/payment_method.model');
var Cart = require('../models/cart.model');
var data = require('../layout.data')
const shortid = require('short-id');
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

module.exports.get = function(req, res){

}

module.exports.post = async function(req, res){
    req.body.products = res.locals.cartItems;
    req.body.payment_status = "Chưa thanh toán";
    req.body.status = "Chờ xác nhận";
    var deliveryMethod = await DeliveryMethod.findById(req.body.delivery_method);
    var paymentMethod = await PaymentMethod.findById(req.body.payment_method);
    req.body.totalPrice = res.locals.finalPrice + deliveryMethod.cost
    
    var currentUser = await Account.findOne({ _id: req.signedCookies.userID });
    var address = {
        name: currentUser.name,
        phone: currentUser.phone,
        address: req.body.address,
    };
    req.body.delivery_address = address;
    req.body.code = shortid.generate().toUpperCase();
    var order = new Order(req.body);
    Order.create(order);

    if (currentUser.delivery_address[0].address === "") {
        currentUser.delivery_address[0].address = req.body.address;
        currentUser.markModified("delivery_address");
        currentUser.save();
    }

    order.dm = deliveryMethod.content
    order.pm = paymentMethod.content

    req.session.destroy();
    res.locals.cartLength = 0;
    res.locals.cartItems = [];
    res.locals.finalPrice = 0;
    Cart.removeCart();

    setDateCreate(order);
    sendEmail(res, currentUser.email, order);

    res.render('./checkout/success', {
        data: data.data,
        order
    });
}


var setDateCreate = function (order) {
    var m = order.date.getMonth() + 1;
    var d = order.date.getDate();
    var y = order.date.getFullYear();
    order.date_create = d + "/" + m + "/" + y;
};

async function sendEmail(res, email, order) {
    var transporter = nodemailer.createTransport(
        smtpTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: "dobadov3@gmail.com",
                pass: "0944609933",
            },
        })
    );

    var mailOptions = {
        from: "gundamshop@gmail.com",
        to: email,
        subject: "[AATOYS] Your order",
        html: `
        <table>
            <thead>
                <tr>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                </tr>
            </thead>
            ${order.products.map(product => {
                return `
                <tr>
                    <td><img src="${product.image[0]}" width=50/></td>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.priceSale.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</td>
                </tr>
                `
            })}
        </table>
        <h1 class="text-danger">ĐÂY LÀ ĐƠN HÀNG CỦA BẠN ĐÃ ĐẶT</h1>
        <p>Mã đơn hàng: ${order.code}</p>
        <p>Ngày mua hàng: ${order.date_create}</p>
        <p>Tên người nhận: ${order.delivery_address.name}</p>
        <p>Địa chỉ giao hàng: ${order.delivery_address.address}</p>
        <p>Số điện thoại: ${order.delivery_address.phone}</p>
        <p>Phương thức giao hàng: ${order.dm}</p>
        <p>Phương thức thanh toán: ${order.pm}</p>
        <p>Tổng số tiền phải thanh toán: ${order.totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</p>
        <h4>Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng</h4>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.render("./authentication/forgot-pass", {
                error,
                values: email,
            });
        } else {
            res.render("./authentication/success");
        }
    });
}