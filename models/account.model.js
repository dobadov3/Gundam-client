var mongoose = require('mongoose');
const mongooseDateFormat = require("mongoose-date-format");
const { ObjectID } = require("mongodb");


var accountSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    phone: {
        type: String, 
        default: ""
    },
    id_role: String,
    delivery_address: Array,
    wishList: Array,
    username: String,
    date_create: { type: Date, default: new Date() },
    cmnd: String,
    job: String,
    gender: String,
    resetLink: {
        type: String,
        default: ""
    },
    type: {
        type: String, 
        default: "normal"
    }
});


var Account = mongoose.model('Account', accountSchema, 'account');


module.exports = Account;