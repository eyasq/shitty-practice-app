const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path')
const app = express();
var Rest = require('./models/rest')
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

app.get('/home',async(req,res)=>{
    var rests = await Rest.find({})
    res.render('pages/home.ejs', {rests})
})
app.get('/new',(req,res)=>{
    res.render('pages/new.ejs')
})
app.post('/home',async(req,res)=>{
    var rest =  new Rest(req.body.rest);
    await rest.save();
    res.redirect('/home')
})


app.listen('3000',()=>{
console.log('listening on 3000')
})