const express = require('express')
const app = express()
const router = express.Router();
const {wrapAsync} = require('../utils/wrapAsync')
const AppError = require('../utils/AppError')
const Review = require('../models/reviews')
const Rest = require('../models/rest')
const {validateRest} = require('../utils/schemas')



router.get('',wrapAsync(async(req,res)=>{
    var rests = await Rest.find({})
    res.render('pages/home.ejs', {rests})
}))
router.get('/new',(req,res)=>{
    res.render('pages/new.ejs')
})
router.post('',validateRest,async(req,res)=>{
    var rest =  new Rest(req.body.rest);
    await rest.save();
    req.flash('success','Succesffuly added restaurant')
    res.redirect('/home')
})
router.get('/:id',wrapAsync(async(req,res)=>{
    var restId = req.params.id;
    var rest = await Rest.findById(restId).populate('reviews')
    res.render('pages/show',{rest})
}))

router.get('/:id/edit',wrapAsync(async(req,res)=>{
    var restId = req.params.id;
    var rest = await Rest.findById(restId)
    res.render('pages/edit',{rest})
}))
router.put('/:id',validateRest,wrapAsync(async(req,res)=>{
    var restId = req.params.id;
    var restEdited = await Rest.findByIdAndUpdate(restId,req.body.rest,{new:true, runValidators:true})
    await restEdited.save();
    res.redirect(`/home/${restId}`)
}))
router.delete('/:id/',async(req,res)=>{
var {id} = req.params;
await Rest.findByIdAndDelete(id)
res.redirect('/home')
})

module.exports = router;