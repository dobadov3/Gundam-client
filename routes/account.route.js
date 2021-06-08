var express = require("express");
var controller = require("../controllers/account.controller");
var router = express.Router();

router.get("/", controller.getProfile);
router.get("/change-password", controller.getChangePass);
router.get("/history", controller.getHistory);
router.get("/history/detail/:orderID", controller.getDetailHistory);

router.post("/", controller.postProfile);
router.post("/change-password", controller.postChangePass);
router.post("/add-new-address", controller.postAddNewAddress);
router.post("/history/detail/:productID/rating", controller.postRating);

module.exports = router;
