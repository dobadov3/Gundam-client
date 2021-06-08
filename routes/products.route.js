var express = require('express');
var controller = require('../controllers/products.controller');
var router = express.Router();

router.get('/', controller.get);

router.get('/search', controller.search);

router.get('/:cateID', controller.getByCategory);

router.get('/detail/:productID', controller.getDetail);

router.get('/cate/:cateName', controller.getCategory);

router.get('/add-to-cart/:productID', controller.addToCart);

router.get('/add-to-wishlist/:productID', controller.addToWishList);

router.get("/:cateID/:sort", controller.getSort);


module.exports = router;