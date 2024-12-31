const mongoose = require('mongoose')
const {Schema} = mongoose;

const restModel = new Schema({
    name:{
        type:String,
        required:[true,'Restuarant name cannot be empty']
    },
    price:{
        type:Number,
        required:[true,'Price cannot be empty']
    },
    location:{
        type:String,
        required:[true,'Location cannot be empty']
    },
    description:{
        type:String,
        required:[true,'Description cannot be empty']
    },
    image:{
        type:String,
        required:[true,'Image cannot be empty']
    },
})

module.exports = mongoose.model('Rest',restModel)