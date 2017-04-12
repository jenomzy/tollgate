var express = require('express');
var router = express.Router();
var User = require('../models/users.model');
var history = require('../models/history.model');
var date = new Date();
var today={
    date: date.toDateString(),
    time:date.getTime()
};


/* GET users listing. */
router.get('/:card', function (req, res, next) {
  User.find({ card: req.params.card },{_id:0,name:1,balance:1}).exec(function (err, user) {
    if (err) {
      res.json(err);
      return console.log(err);
    }
    else {
      res.json(user);
    }
  });
  // res.send('respond with a resource');
});

router.get('/', function (req, res, next) {
    User.find({},{_id:0,card:0}).exec(function (err, user) {
        if (err) {
            res.json(err);
            return console.log(err);
        }
        else {
            res.json(user);
        }
    });
    // res.send('respond with a resource');
});

module.exports = router;


/*
303f575
7672403b
*/


