// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));


app.get('/',function(req,res){
  res.render("Login");
})

app.get('/adduser',function(req,res){
  res.render("AddUser");
})

app.get('/userlist',function(req,res){
  res.render("Userlist");
})

app.get('/bugslist',function(req,res){
  res.render('bugslist.ejs');
})

app.get('/developer',function(req,res){
  res.render('developer.ejs');
})

app.get('/tester',function(req,res){
  res.render('tester.ejs');
})

app.post('/',function(req,res){
  /*if(req.body.username === 'dev'){
    res.redirect("/developer");
  }else if (req.body.username === 'tester') {
    res.redirect("/tester");
  }else if (req.body.username === 'admin') {
    res.redirect("/adduser");
  }else {
    res.redirect('/');
  }*/
  console.log(req.body.username);
  res.redirect("/adduser");
})

app.post('/adduser',function(req,res){
  res.redirect("/userlist");
})

/*app.post('/',function(req,res){
  res.redirect("/adduser");
})*/








app.listen(8484,function(){
  console.log("Server statred on  port 8484")
})
