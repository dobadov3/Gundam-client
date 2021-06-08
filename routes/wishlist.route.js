const express = require('express');
const router = express.Router();
const controller = require('../controllers/wishlist.controller');

router.get('/', controller.get);
router.get('/remove/:productID', controller.remove);

module.exports = router;