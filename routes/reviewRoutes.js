
const express = require('express')
const app = express()
const router = express.Router({mergeParams:true});
const {wrapAsync} = require('../utils/wrapAsync')
const Review = require('../models/reviews')
const Rest = require('../models/rest')
const {validateReview} = require('../utils/schemas')


router.post('/',validateReview,wrapAsync(async(req,res)=>{
    var restId = req.params.id;
    const rest = await Rest.findById(restId)
    const review = new Review(req.body.review)
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