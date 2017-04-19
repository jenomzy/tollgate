var express = require('express');
var Users = require('../models/users.model');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function (req, res, next) {
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