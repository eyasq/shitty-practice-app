var Joi = require('joi')
var AppError = require('./AppError')
const validateRest = function(req,res,next){
    const restSchema = Joi.object({
        rest:Joi.object({
            name:Joi.string().required(),
            price:Joi.number().required().min(0),
            location:Joi.string().required(),
            description:Joi.string().required(),
            image:Joi.string().required()
        }).required()

    })
    var res = restSchema.validate(req.body)
    if(res.error){
        throw new AppError('Validation failed!',400)
    }
    else{
        next()
    }
}
module.exports = validateRest;