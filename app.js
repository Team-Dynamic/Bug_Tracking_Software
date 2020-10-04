// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//const addUser = require(__dirname+"AddUser.js");
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/AddUser", { useNewUrlParser: true, useUnifiedTopology: true  });

const AddUserSchema = new mongoose.Schema({
    employee_Id: Number,
    name: {
        type : String,
        required : [true, "Please fill the details"]
    },
    email:{
        type : String,
        required : [true]},

    contact:
    {
        type : String,
        validate:{
        validator: function(v) {
            return /\d{10}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    role : {
     type : String,
     enum : ['Developer', 'Tester', 'Admin'],

    },
        project_assigned : String,
        password : String

});

const user = mongoose.model("user",AddUserSchema);

const user1  = new user ({
    employee_Id: 2512,
    name: "Gaurav Garg",
    email: "garggaurav460@gmail.com",
    contact : "9993041370",
    role : "Developer",
    project_assigned : "Bug Tracking",
    password : "password1"
});

const user2  = new user ({
    employee_Id: 6432,
    name: "Rusheendra",
    email: "rushee2911@gmail.com",
    contact : "9440051673",
    role : "Developer",
    project_assigned : "Bug Tracking",
    password : "password2"
});

const user3  = new user ({
    employee_Id: 2520,
    name: "Trupti",
    email: "Tnt10@gmail.com",
    contact : "2122232212",
    role : "Admin",
    project_assigned : "Bug Tracking",
    password : "password3"
});

const defaultusers = [user1,user2,user3];

user.insertMany([user1, user2, user3], function(err)
{
if (err){
  console.log(err);
}
else{
   console.log("Successful");
}});



app.get('/',function(req,res){
  res.render("Login");
})

app.get('/adduser',function(req,res){
  res.render("AddUser");
})

app.get('/userlist',function(req,res){
  console.log("running user list.");
  user.find({},function(err, foundusers){
    if(foundusers.length!=0){
    console.log(foundusers[1]);
    res.render("Userlist",{userList:foundusers});
  }else{
    user.insertMany([user1, user2, user3], function(err)
    {
    if (err){
      console.log(err);
    }
    else{
       console.log("Successful");
    }});
    redirect("/userlist");
  }
});
});

app.get('/bugslist',function(req,res){
  res.render('bugslist');
})

app.get('/developer',function(req,res){
  res.render('developer');
})

app.get('/tester',function(req,res){
  res.render('tester');
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
  console.log(req.body);
  res.redirect("/adduser");
})

app.post('/adduser',function(req,res){
  console.log(req.body.name);
  res.redirect("/userlist");
})

/*app.post('/',function(req,res){
  res.redirect("/adduser");
})*/








app.listen(8484,function(){
  console.log("Server statred on  port 8484")
})
