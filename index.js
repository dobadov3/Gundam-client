const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var route = require('./routes/index.route');
var session = require('express-session')
var cors = require('cors')
require('dotenv').config();
const passport = require('passport')
const facebookStrategy = require('passport-facebook').Strategy

app.use(cors())

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect('mongodb://localhost/gundam', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))
  
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    next();
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(cookieParser(process.env.SESSION_SECRET));

var sessionMiddleware = require('./middlewares/session.middleware');
var authMiddleware = require('./middlewares/auth.middleware');

passport.use(
    new facebookStrategy(
        {
            clientID: "620204319372521",
            clientSecret: "e5916e9ade27bddad23de89ac9676699",
            callbackURL: "http://localhost:3000/authentication/facebook/callback",
            profileFields: ["id", "displayName", "name", "gender", "email", "picture.tpye(large)"],
        },
        function (token, refreshToken, profile, done) {
          process.nextTick(function () {
              // console.log(token, refreshToken, profile, done);



              return done(null, profile);
          });
        }
    )
);


app.set('view engine', 'pug');
app.set('views', './views');

app.use(sessionMiddleware);
app.use(authMiddleware);


app.get('/', (req, res) => {
    res.redirect('/home')
});

route(app);

app.listen(port);