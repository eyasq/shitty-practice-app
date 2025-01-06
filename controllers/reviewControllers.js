const Review = require('../models/reviews')
const {validateReview}  = require('../utils/schemas')
const {isLoggedIn,isOwnerReview} =require('../utils/middleware')
const {wrapAsync} = require('../utils/wrapAsync')
module.exports.postReview = [validateReview,isLoggedIn,wrapAsync(async(req,res)=>{
    var restId = req.params.id;
    const rest = await Rest.findById(restId)
    const review = new Review(req.body.review)
    review.author = req.user;
    rest.reviews.push(review)
    await review.save()
    await rest.save()
    req.flash('success','Successfully Added Review')
    res.redirect(`/home/${restId}`, )
})]

module.exports.destroyReview =[isOwnerReview, async(req,res)=>{
    var {id, revId} = req.params;
    await Review.findByIdAndDelete(revId)
    req.flash('success','Succesfully Deleted Review')
    res.redirect(`/home/${id}`)
}]