const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path')
const app = express();
var Rest = require('./models/rest')
var Review = require('./models/reviews')
var AppError =require('./utils/AppError')
var  {wrapAsync} =require('./utils/wrapAsync')
var validateRest = require('./utils/schemas')
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_method'))

mongoose.connect('mongodb://localhost:27017/bidyaR')
.then(()=>{
    console.log('mongo con success')
}).catch((e)=>{
    console.log(e,'mongo conn error')
})

app.get('/home',wrapAsync(async(req,res)=>{
    var rests = await Rest.find({})
    res.render('pages/home.ejs', {rests})
}))
app.get('/new',(req,res)=>{
    res.render('pages/new.ejs')
})
app.post('/home',validateRest,async(req,res)=>{
    var rest =  new Rest(req.body.rest);
    await rest.save();
    res.redirect('/home')
})
app.get('/home/:id',wrapAsync(async(req,res)=>{
    var restId = req.params.id;
    var rest = await Rest.findById(restId).populate('reviews')
    console.log(rest)
    res.render('pages/show',{rest})
}))
app.post('/home/:id/reviews',async(req,res)=>{
    var restId = req.params.id;
    const rest = await Rest.findById(restId)
    const review = new Review(req.body.review)
    rest.reviews.push(review)
    await review.save()
    await rest.save()
    res.redirect(`/home/${restId}`)
})
app.delete('/home/:id/reviews/:revId',async(req,res)=>{
    var {id, revId} = req.params;
    await Review.findByIdAndDelete(revId)
    res.redirect(`/home/${id}`)
})
app.get('/home/:id/edit',wrapAsync(async(req,res)=>{
    var restId = req.params.id;
    var rest = await Rest.findById(restId)
    res.render('pages/edit',{rest})
}))
app.put('/home/:id',validateRest,wrapAsync(async(req,res)=>{
    var restId = req.params.id;
    var restEdited = await Rest.findByIdAndUpdate(restId,req.body.rest,{new:true, runValidators:true})
    await restEdited.save();
    res.redirect(`/home/${restId}`)
}))
app.delete('/home/:id/',async(req,res)=>{
var {id} = req.params;
await Rest.findByIdAndDelete(id)
res.redirect('/home')
})
app.all('*',(req,res,next)=>{
    throw new AppError('Page not found!',404)
    next();
})
app.use((err,req,res,next)=>{
    var {status = 500, message = 'Something went wrong!'} = err;
    if(err.name == 'ValidationError'){
        err.message = 'Validation Fail'
        err.status = 400;
    }
    else if(err.name == 'CastError'){
        err.message = 'Could not cast to this ID'
        err.status = 400;
    }
    res.status(status).render('error.ejs',{err})
})
app.listen('3000',()=>{
console.log('listening on 3000')
})