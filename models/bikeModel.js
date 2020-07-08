var mongoose = require('mongoose');

var bikesSchema = mongoose.Schema({
        
        name : String,
        url :String,
        price:Number,
        quantity:Number,
        description:String

});


var bikesModel = mongoose.model('bikes', bikesSchema);

module.exports=bikesModel
;