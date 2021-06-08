var express = require('express');
var router = express.Router();
var controller = require('../controllers/authentication.controller');
const passport = require("passport");

router.get('/', controller.get);

router.get('/logout', controller.logout);

router.get("/forgot-pass", controller.getForgot);

router.get("/reset-pass/:resetLink", controller.getResetPass);

router.post('/login', controller.postLogin);

router.post('/', controller.postSignUp);

router.post("/forgot-pass", controller.postForgot);

router.post("/reset-pass", controller.resetPass);

router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: 'email'
}))

router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/home",
        failureRedirect: "/authentication",
    })
);

module.exports = router;