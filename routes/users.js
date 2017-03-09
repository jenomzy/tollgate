var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = "mongodb://localhost/tollgate"
mongoose.connect(db);
var User = require('../models/users.model');



/* GET users listing. */
router.get('/', function (req, res, next) {
  User.find().exec(function (err, user) {
    if (err) {
      res.json(err)
      return console.log(err);
    }
    else {
      res.json(user);
    }
  })
  // res.send('respond with a resource');
});

module.exports = router;
