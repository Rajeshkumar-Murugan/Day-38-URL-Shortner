const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/urlShort')
const {UrlModel} = require('./model/url-model.js')

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}))

app.get('/', function(req,res){
    let allUrls = UrlModel.find().then(function(allUrlData){
        res.render('home',{allUrlData})  

    }).catch(function(err){
        console.log(err)
    })
})

app.post('/create', function(req,res){
    let myRandomNumber = Math.floor(Math.random()*10000)

    let newURLshort = new UrlModel({
        longUrl: req.body.longUrl,
        shortUrl:myRandomNumber
    })

    newURLshort.save().then(function(saveData){
        res.redirect('/')
    }).catch(function(err){
        console.log(err)

    })
})

app.get('/:shortID', function(req,res){
    UrlModel.findOne({shortUrl:req.params.shortID})
    .then(function(data){
    UrlModel.findByIdAndUpdate({_id:data.id},{$inc:{clickCount: 1}})
    .then(function(updateData){
        res.redirect(data.longUrl)
    }).catch(function(err){
        console.log(err)
    })  
    }).catch(function(err){
        console.log(err)
    })
})

app.get('/delete/:id', function(req,res){
    UrlModel.findByIdAndDelete({_id:req.params.id}).then(function(data){
        res.redirect('/')
    }).catch(function(err){
        console.log(err)
    })
})

app.listen(3000, function(){
    console.log("Server is up in Port 3000")})