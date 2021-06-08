var Account = require("../../models/account.model");
const Order = require("../../models/order.model");

module.exports.get = async function (req, res) {
    var account = res.locals.currentAccount;
    if(account){
        var orders = await Order.find({
            id_account: account._id,
        });
        var totalOrder = orders.length;
        var totalOrderValue = 0;
    
        for (let i = 0; i < orders.length; i++) {
            totalOrderValue += orders[i].totalPrice;
        }
    
        setDateCreate(account);
    
        var api = {
            username: account.username,
            email: account.email,
            date: account.date,
            totalOrder,
            totalOrderValue,
        };
    
        res.json(api);
    }
};

var setDateCreate = function (currentAccount) {
    var m = currentAccount.date_create.getMonth() + 1;
    var d = currentAccount.date_create.getDate();
    var y = currentAccount.date_create.getFullYear();
    currentAccount.date = d + "/" + m + "/" + y;
};
