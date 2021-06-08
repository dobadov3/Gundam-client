var data = require('../layout.data')
var Account = require('../models/account.model');
var Role = require('../models/role.model');
var md5 = require('md5');
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const passport = require("passport");

module.exports.get = async function(req, res) {
    res.render('./authentication/index', {
        data: data.data
    });
};

module.exports.postLogin = async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var user = await Account.findOne({ 
        email: email, type: "normal" 
    });

    var userByUserName = await Account.findOne({
        username: email,
        type: "normal"
    });

    if(!user && !userByUserName){
        res.render("./authentication/index", {
            error: "Account doesn't exits!",
            data: data.data,
            values: req.body,
        });
        return;
    }else{
        if(user){
            if (md5(password) !== user.password) {
                res.render("./authentication/index", {
                    error: "Wrong password!",
                    data: data.data,
                    values: req.body,
                });
                return;
            }
    
            res.cookie("userID", user.id, {
                signed: true,
            });
        }else{
            if (md5(password) !== userByUserName.password) {
                res.render("./authentication/index", {
                    error: "Wrong password!",
                    data: data.data,
                    values: req.body,
                });
                return;
            }
    
            res.cookie("userID", userByUserName.id, {
                signed: true,
            });
        }
    }
 
    res.redirect('/home');
};

module.exports.logout = function(req, res) {
    res.clearCookie("userID");
    req.session.destroy((err) => {
        if (err) {
            return;
        }

        req.logout();
    });
    
    res.redirect('/home');
}

module.exports.postSignUp = async function(req, res) {
    req.body.email = req.body.emailSignUp;
    var password = req.body.passwordSignUp;
    var confirmPass = req.body.confirmPassword;
    var errorSignUp = "";
    var newUser = new Account(req.body);
    var delivery_address = {
        name: req.body.name,
        phone: req.body.phone,
        address: "",
    };

    var user = await Account.findOne({ email: req.body.email, type: 'normal' });

    if (user) {
        errorSignUp = "Account already exist!";
        res.render('./authentication/index', {
            errorSignUp,
            data: data.data,
            values: req.body
        })
        return;
    }


    if (password !== confirmPass) {
        errorSignUp = "Confirm password is not correct!";
        res.render('./authentication/index', {
            errorSignUp,
            data: data.data,
            values: req.body
        })
        return;
    }

    newUser.password = md5(password);
    newUser.delivery_address.push(delivery_address);

    Account.create(newUser);

    res.redirect('back');
}

module.exports.getForgot = async function(req, res){
    res.render('./authentication/forgot-pass')
}

module.exports.postForgot = async function(req, res){
    Account.findOne({email: req.body.email, type: 'normal'}, (err, account) => {
        if(err || !account){
            res.render("./authentication/forgot-pass", {
                error: "Account doesn't exist!!",
                values: req.body.email,
            });
            return;
        }

        var token = jwt.sign({ _id: account._id }, process.env.RESET_PASSWORD_KEY, {expiresIn: '20m'});

        account.resetLink = token;
        account.save()

        sendEmail(res, req.body.email, token)
    })
    console.log("POST Forgotpass")
}

module.exports.getResetPass = async function(req, res){
    const {resetLink} = req.params
    res.render("./authentication/reset-pass", {
        resetLink
    });
}

module.exports.resetPass = async function(req, res){
    const { newPass, confirmPass, resetLink } = req.body;
    if (resetLink){
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, (error, decodedData) => {
            if (error){
                res.render("./authentication/reset-pass", {
                    error: "Mã đặt lại mật khẩu đã hết hạn",
                });
                return;
            }

            Account.findOne({resetLink}, (err, account) => {
                if (err || !account){
                    res.render("./authentication/reset-pass", {
                        error: "Tài khoản không tồn tại",
                    });
                    return;
                }
                if (newPass === confirmPass){
                    account.password = md5(newPass);
                    account.resetLink = "";
                    account.save();
                    res.redirect('/authentication');
                }else{
                    res.render("./authentication/reset-pass", {
                        error: "Mật khẩu xác nhận không đúng",
                        resetLink,
                    });
                }
            })
        })
    }
}

async function sendEmail(res, email, token) {
    var transporter = nodemailer.createTransport(
        smtpTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: "dobadov3@gmail.com",
                pass: "0944609933",
            },
        })
    );

    var mailOptions = {
        from: "gundamshop@gmail.com",
        to: email,
        subject: "[AATOYS] Email reset password",
        html: `<h1>ĐÂY LÀ EMAIL KHÔI PHỤC MẬT KHẨU</h1><br/><p>Nhấn vào link dưới đây để khôi phục lại mật khẩu của bạn</p><a href="${process.env.CLIENT_URL}/authentication/reset-pass/${token}">Click this link</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.render("./authentication/forgot-pass", {
                error,
                values: email,
            });
        } else {
            res.render("./authentication/success");
        }
    });
}

passport.serializeUser(async(user, done) => {
    // console.log("user", user);

    done(null, user);
});

passport.deserializeUser((obj, done) => {
    console.log("obj", obj);
    return done(null, obj);
});
