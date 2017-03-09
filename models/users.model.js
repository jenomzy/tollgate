var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    sex: String,
    balance:{
        type: Number,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone: String,
    card:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('users', UserSchema);