const mongoose = require('mongoose')
const {Schema} = mongoose;
const User = require('./user')
const reviewSchema = new Schema({
    body:{
        type:String,
        required:(true,'Review cannot have empty body.')
    },
    rating:{
        type:Number,
        required:(true,'Review cannot have no score'),
        min:0,
        max:10
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})
module.exports = mongoose.model('Review',reviewSchema)