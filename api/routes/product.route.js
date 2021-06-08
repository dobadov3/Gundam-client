var express = require('express');
var router = express.Router();
var controller = require('../controllers/product.controller');

router.get('/:cateID/:page', controller.get);
router.get('/:cateID/:page/:sort', controller.sort);

module.exports = router;
