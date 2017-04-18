var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var historySchema = new Schema({
    date:{
        type: Date,
        required: true
    },
    users:[
        {
            _id: {type:Schema.Types.ObjectId,required:true},
            name:{ type:String,required:true},
            balance: {type: Number, required:true},
            time: Date
        }
    ]
});

/*historySchema.methods.parseTime = function(){
    return new Date(this.time).toTimeString();
};*/

module.exports = mongoose.model('history', historySchema);