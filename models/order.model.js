var mongoose = require('mongoose');
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var orderSchema = new mongoose.Schema({
    delivery_method: String,
    payment_method: String,
    payment_status: String,
    id_account: String,
    delivery_address: Object,
    products: Array,
    paymentMethod: String,
    status: String, 
    date: {
        type: Date,
        default: new Date()
    },
    totalPrice: Number,
    code: String,
    delivery: String,
    payment: String
});

orderSchema.post('save', (order) => {
    sendEmail(order)
})

async function sendEmail(order) {
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
        to: "dobadov3@gmail.com",
        subject: "[AATOYS] HAVE A NEW ORDER!",
        html: `<h1>CÓ MỘT ĐƠN HÀNG MỚI</h1><br/><p>Nhấn vào link dưới đây để xem chi tiết đơn hàng</p><a href="${process.env.ADMIN_URL}/orders/edit/${order._id}">Click this link</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log("Success")
        }
    });
}

var Order = mongoose.model('Order', orderSchema, 'order');

module.exports = Order;