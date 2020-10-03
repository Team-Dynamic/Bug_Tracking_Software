// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get('/',function(req,res){
  res.sendFile(__dirname + "/UI/index.html")
})

app.get('/adduser',function(req,res){
  res.sendFile(__dirname + "/UI/Add User.html")
})

app.get('/userlist',function(req,res){
  res.sendFile(__dirname + "/UI/Add User.html")
})

app.post('/adduser',function(req,res){
  res.redirect("/");
})







app.listen(8484,function(){
  console.log("Server statred on  port 8484")
})
