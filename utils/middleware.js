var passport = require("passport");
var Rest = require('../models/rest')
const Review = require('../models/reviews')
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in to view this page");
    return res.redirect('/login');
  }
  next();
};
module.exports.isLoggedIn = isLoggedIn;

const isOwner = async(req,res,next)=>{
  const {id} = req.params;
  const rest = await Rest.findById(id)
  if(!rest.author._id.equals(req.user._id)){
    req.flash('error','You are not the author of this listing!')
    return res.redirect(`/home/${id}`)
  }
  next()
}
module.exports.isOwner = isOwner;

const isOwnerReview = async(req,res,next)=>{
  const {revId} = req.params;
  const review = await Review.findById(revId)
  if(!review.author._id.equals(req.user._id)){
    req.flash('error','You are not the author of this Review!')
    return res.redirect(`/home/${id}`)
  }
  next()
}
module.exports.isOwnerReview = isOwnerReview;