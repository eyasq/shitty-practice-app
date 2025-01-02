const mongoose = require('mongoose')
const {Schema} = mongoose;
const Review = require('./reviews')
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
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:'Review'
    }]
})
restModel.post('findOneAndDelete',async(doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Rest',restModel)