var express = require('express');
var Router = express.Router();
var Admin = require('../models/admin_user.model');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/register', function (req, res, next) {
    res.render('register', {
        title: "User Registration"
    });
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
            password: password
        });

        User.createUser(newUser, function (err, user) {
            if (err) throw  err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user)
    });
});