// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
var datas = [];

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static("public"));



app.get('/',function(req,res){
  res.render("Login");
})

app.get('/signup',function(req,res){
  res.render("signup");
})

app.get('/adduser',function(req,res){
  res.render("AddUser");
})

app.get('/userlist',function(req,res){
  res.render("Userlist");
//  console.log(datas);
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
  if(req.body.username === 'dev'){
    res.redirect("/developer");
  }else if (req.body.username === 'tester') {
    res.redirect("/tester");
  }else if (req.body.username === 'admin') {
    res.redirect("/adduser");
  }else {
    res.redirect('/');
  }
  //console.log(req.body.abc);
  //res.redirect("/adduser");
})

app.post('/adduser',function(req,res){
/*  const data = {
    name: req.body.name,
    conatct_no : req.body.contact_no,
    id : req.body.eid,
    email : req.body.email,
    password : req.body.pass
  };
  datas.push(data);*/
  console.log(req.body.name);
  res.redirect("/userlist");
})

/*app.post('/',function(req,res){
  res.redirect("/adduser");
})*/
app.post('/signup',function(req,res){
  console.log(req.body.email);
})








app.listen(8484,function(){
  console.log("Server statred on  port 8484")
})
