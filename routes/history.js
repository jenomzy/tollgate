var express = require('express');
var router = express.Router();
var User = require('../models/users.model');
var History = require('../models/history.model');
var date = new Date();
var today = {
    date: date.toDateString(),
    time: date.getTime()
};

router.get('/', function (req, res, next) {
    History.find({},{_id:0}).exec(function (err, history) {
     if (err) {
     res.json(err);
     return console.log(err);
     }
     history[0].users.forEach(function(item,index,array){
     // var provItem = new Date(item.time).toTimeString();
     item.time = new Date(item.time).toTimeString();

     if (index === array.length-1){
     res.json(history);
     }
     });

        // res.json(history[0].users);
     });
});

module.exports = router;