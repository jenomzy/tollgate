var express = require('express');
var router = express.Router();
var User = require('../models/users.model');
var date = new Date();
var today = {date: date.toDateString(), time: date.getTime()};
var request = require("request-json");
var url = require("url");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

require('hbs').registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = Number(lvalue);
    rvalue = Number(rvalue);

    var trick = lvalue;

    return {
        "===":lvalue>rvalue,
        "+=":trick+=rvalue,
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];

});
require('hbs').registerHelper('compare', function(lvalue, rvalue, options) {

    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    var operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    };

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

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
       if(err) throw err;
       res.json(result);
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