const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path')
const app = express();
var AppError = require('./utils/AppError')
const restRoutes = require('./routes/restRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
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
app.use('/home',restRoutes)
app.use('/home/:id/reviews',reviewRoutes)
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