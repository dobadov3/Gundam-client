var data = require('../layout.data')
var sessionMiddleware = require('../middlewares/session.middleware');
var wishlist = require('../models/wishlist.model');
const Account = require('../models/account.model')

module.exports.get = async function(req, res){
  if (!req.signedCookies.userID) {
    res.redirect('/authentication');
    return;
  }
  
  var products = [];
  var currentAccount = await Account.findById(res.locals.currentAccount._id);


  products = [...currentAccount.wishList];

  res.render('./wishlist/index', {
      data: data.data, 
      products,
      cartLength: res.locals.cartLength,
      cartItems: res.locals.cartItems,
      finalPrice: res.locals.finalPrice,
  });
}

module.exports.remove = async function(req, res){
  var productID = req.params.productID;
  var account = await Account.findById(res.locals.currentAccount._id);
  var wishList = [...account.wishList];
  account.wishList.forEach((item) => {
      if (item._id.equals(productID)) {
          var index = account.wishList.indexOf(item);
          wishList.splice(index, 1)
          account.wishList = wishList;
          account.markModified('wishList');
          account.save();
      }
  });
  wishlist.remove();;
  res.redirect('back')
}