const mongoose = require('mongoose')
const {Schema} = mongoose;
const Review = require('./reviews')
const User = require('./user')
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
    images:[{
        url:{
            type:String,
            required:[true,'Image URL cannot be empty']
        },
        filename:{
            type:String,
            required:[true,'Filename cannot be empty']
        }
    }],
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:'Review'
    }],
    author:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    }

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