
const express = require('express')
const app = express()
const router = express.Router({mergeParams:true});
const {wrapAsync} = require('../utils/wrapAsync')
const Review = require('../models/reviews')
const Rest = require('../models/rest')
const {validateReview} = require('../utils/schemas')
const {isLoggedIn} = require('../utils/middleware')

router.post('/',validateReview,isLoggedIn,wrapAsync(async(req,res)=>{
    var restId = req.params.id;
    const rest = await Rest.findById(restId)
    const review = new Review(req.body.review)
    review.author = req.user;
    rest.reviews.push(review)
    await review.save()
    await rest.save()
    req.flash('success','Successfully Added Review')
    res.redirect(`/home/${restId}`, )
}))
router.delete('/:revId',async(req,res)=>{
    var {id, revId} = req.params;
    await Review.findByIdAndDelete(revId)
    req.flash('success','Succesfully Deleted Review')
    res.redirect(`/home/${id}`)
})


module.exports = router;