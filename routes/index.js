var express = require('express');
var Users = require('../models/users.model');
var router = express.Router();


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



/* GET home page. */
router.get('/', ensureAuthenticated, function (req, res, next) {
    /**/



    res.render('index', {
        title: 'Toll Payment System',
        user: {
            name: req.user.name,
            id: req.user._id,
            email: req.user.email,
            sex: req.user.sex,
            phone: req.user.phone,
            address: req.user.address,
            username: req.user.username,
            balance: req.user.balance,
            history: req.user.history
        }
    });
});

router.get('/view_full_history', ensureAuthenticated, function (req, res, next) {

    var trick = 0;
    var temp = 0;
    require('hbs').registerHelper("math", function(lvalue, operator, rvalue, index) {
        lvalue = Number(lvalue);
        rvalue = Number(rvalue);
        temp = lvalue;
        index = Number(index);
        if(index === 0) {
            trick = lvalue;
        }else {
            trick += rvalue;
        }
        return {
            "===":lvalue===rvalue,
            "+=":trick,
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    });
    trick = temp;

    res.render('history', {
        title: "History " + req.user.name,
        user: {
            name: req.user.name,
            username: req.user.username,
            history: req.user.history,
            balance: req.user.balance
        }
    })
});

router.get('/deposit_money', ensureAuthenticated, function (req, res, next) {
    res.render('deposit',{
        title: "Deposit Money to the User",
        user: {
            name: req.user.name,
            id: req.user._id,
            email: req.user.email,
            username: req.user.username,
            balance: req.user.balance
        }
    })
});

router.post('/deposit_money', ensureAuthenticated, function (req, res, next) {
    Users.update({_id: req.user._id},{
        $inc: {
            balance: req.body.amount
        },$push: {
            history:{
                $each:[{
                    "date": new Date().toISOString(),
                    "place": "Online User Portal",
                    "diff": req.body.amount
                }],
                $position: 0
            }
        }
    },function (err) {
        if(err) throw err;
        else{
            res.redirect('/');
        }
    });

});

router.post('/verify_toll/:id', ensureAuthenticated, function (req, res, next) {
    var place = req.query.place;
    var id = req.params.id;
    res.send('Welcome');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

module.exports = router;