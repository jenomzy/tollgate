var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var historySchema = new Schema({
    date:{
        type: Date,
        required: true
    },
    users:[
        {
            name: String,
            balance: Number,
            time:{
                type: Date,
                default: Date,
            }
        }
    ]
});

module.exports = mongoose.model('history', historySchema);