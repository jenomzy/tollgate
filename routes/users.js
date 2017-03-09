var express = require('express');
var router = express.Router();
var User = require('../models/users.model');



/* GET users listing. */
router.get('/:card', function (req, res, next) {
  User.find({ card: req.params.card }).exec(function (err, user) {
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
    User.find({}).exec(function (err, user) {
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


