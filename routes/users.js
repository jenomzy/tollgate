var express = require('express');
var router = express.Router();
var User = require('../models/users.model');
var date = new Date();
var today = {date: date.toDateString(), time: date.getTime()};
var request = require("request-json");
var url = require("url");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



var TILL_URL =url.parse(process.env.TILL_URL);
var TILL_BASE = TILL_URL.protocol + "//" + TILL_URL.host;
var TILL_PATH =TILL_URL.pathname;

if (TILL_URL.query != null){
    TILL_PATH += "?"+TILL_URL.query;
}


router.get('/register', function (req, res, next) {
    res.render('register', {
        title: "User Registration"
    });
});

router.get('/login', function (req, res, next) {
    res.render('login', {
        title:"User Login: Tollgate"
    });
});

router.get('/:card', function (req, res, next) {
   User.findOneAndUpdate({card: req.params.card},{
       $inc: {
           balance: req.query.charge
       }, $push: {
               history:{
                   $each:[{
                       "date": new Date().toISOString(),
                       "place": req.query.place,
                       "diff": req.query.charge
                   }],
                   $position: 0
               }
       }
   }, function (err, result) {


       request.createClient(TILL_BASE).post(TILL_PATH, {
           "phone": [result.phone],
           "text": "Hello "+result.name+" You just passed "+req.query.place+ " and was charged "+req.query.charge+". Your new balance is "+result.balance
       },function (err, resp, body) {
           if (err) {
               return console.log(err);
           }
           console.log("SMS sent to "+result.phone+" with statusCode "+resp.statusCode);
           console.log(body);
       });

       if(err) console.log(err);
       res.json({name:result.name,balance:Number(result.balance)+Number(req.query.charge)});
   })
});

router.post('/register', function (req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var card = req.body.card;
    var sex = req.body.sex;
    var phone = req.body.phone;
    var address = req.body.address;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var account_type = req.body.account_type;

    //Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors)
    {
        res.render('register', {
            errors: errors,
            title: 'User Registration'
        });
    }else
    {
        var newUser = new User({
            name: name,
            email: email,
            sex: sex,
            phone: phone,
            address: address,
            card: card,
            username: username,
            password: password,
            account_type: account_type
        });

        User.createUser(newUser, function (err, user) {
            if (err) throw  err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw  err;
            if(!user)
            {
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if(err) throw  err;
                if(!isMatch)
                {
                    return done(null, user);
                }else
                {
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user)
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}),
function (req, res, next) {
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});




module.exports = router;