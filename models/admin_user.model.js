var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
    username:{
        type: String,
        index: true,
        unique:true,
        required: true
    },
    name: String,
    email:{
        type: String,
        required: true,
        unique: true
    },
    account_type: {
        type: String,
        default: "admin"
    },
    password: {
        type: String,
        required: true
    },
    phone: String
});

var Admin = module.exports = mongoose.model('admin_user', AdminSchema);
module.exports.createAdmin = function (newAdmin, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newAdmin.password, salt, function (err, hash) {
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });
};

module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    Admin.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
    Admin.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};