var express = require("express");
var router = express.Router();
var controller = require("../controllers/search.controller");

router.get("/:productName/:page", controller.get);
router.get("/:productName/:page/:sort", controller.sort);

module.exports = router;
