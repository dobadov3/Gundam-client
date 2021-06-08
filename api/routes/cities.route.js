var express = require('express');
var router = express.Router();
var controller = require('../controllers/cities.controller');

router.get('/cities', controller.getCity);
router.get('/cities/:district', controller.getDistrict);

module.exports = router;