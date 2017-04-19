var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    name: String,
    sex: String,
    balance: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: String,
    phone: String,
    card: {
        type: String,
        required: true,
        unique: true
    },
    account_type: {
        type: String,
        default: "user"
    },
    history: [
        {
            date: Date,
            place: String,
            diff: {
                type: Number,
                required: true
            }
        }]
});

var User = module.exports = mongoose.model('users', UserSchema);
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};

/*
 module.exports.execTransaction = function (card, callback) {
 var query = {card: card};
 User.update(query, callback);
 };*/
