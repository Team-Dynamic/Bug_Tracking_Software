//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
var flash = require('express-flash');
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.use(session({
  secret: 'Master of lord of mysteries',
  resave: false,
  saveUninitialized: true
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/bugUserdb", { useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.set("useCreateIndex", true);

const bugUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
      },
    name: {
        type: String,
        required: [true, "Please fill the details"]
    },
    email:{
        type: String,
        required: [true],
        unique: true
      },
    password: String,
    contact:
    {
        type: String,
        validate: {
        validator: function(v) {
            return /\d{10}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    role: {
     type: String,
     enum: ['developer', 'tester', 'admin']
    },
    projects: String,
});

bugUserSchema.plugin(passportLocalMongoose);
const user = mongoose.model("user",bugUserSchema);

passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

const requestSchema = new mongoose.Schema({
  username: String,
  name: {
      type: String,
      required: [true, "Please fill the details"]
  },
  email:{
      type: String,
      required: [true]
    },
  password: String,
  contact:
  {
      type: String,
      validate: {
      validator: function(v) {
          return /\d{10}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      required: [true, 'User phone number required']
  },
  role: {
   type: String,
   enum: ['developer', 'tester', 'admin'],
  },
  projects: String,
})

const user1  = new user ({
    username: "Tst0001",
    name: "Gaurav Garg",
    email: "garggaurav460@gmail.com",
    contact: "9993041370",
    role: "tester",
    projects: "Bug Tracking",
    password: "password1"
});

const user2  = new user ({
    username: "Dev0002",
    name: "Rusheendra",
    email: "rushee2911@gmail.com",
    contact: "9440051673",
    role: "developer",
    projects: "Bug Tracking",
    password: "password2"
});

const user3  = new user ({
    username: "Adm0003",
    name: "Trupti",
    email: "Tnt10@gmail.com",
    contact: "2122232212",
    role: "admin",
    projects: "Bug Tracking",
    password: "password3"
});

/*user.find({},function(err, foundusers){
  if(foundusers.length === 0){
    user.insertMany([user1, user2, user3], function(err){
    if (err){
      console.log(err);
    }
    else{
       console.log("Successful in adding default users.");
    }
  })
}
  else{
    console.log("Default users already added to the database");
  }
})*/

const request = mongoose.model("request",requestSchema);

//signup and login module.
app.get('/',function(req,res){
  res.render("login");
});

app.get('/signup',function(req,res){
  res.render("signup");
});

app.get('/forgotpassword',function(req,res){
    res.render("forgotpassword");
});

app.post("/signup",function(req, res){
  console.log(req.body);
  console.log(req.body);
  user.register({name: req.body.fname,email: req.body.email,contact:req.body.contact_no,
  role:req.body.role,username:req.body.username} ,req.body.password, function(err,user) {
    if(err){
      console.log(err);
      res.redirect("/signup");
    }else{
      res.send("Your signup request has been sent to the admin. Please check your mail for approval.");
    }
  })
})

app.post("/", function(req, res) {
  const userLogin = new user({
    username: req.body.username,
    password: req.body.password
})

 req.login(userLogin, function(err){
   if(err){
     console.log(err);
     res.redirect("/");
   }else{
     console.log(userLogin);
     passport.authenticate("local")(req, res, function(){
       //console.log(req.user);
     console.log(req.user.role);
     let page = "/" + req.user.role + "Homepage"
     res.redirect(page);
    })
   }
  })
 });

app.post("/forgotpassword", function(req,res) {
   console.log(req.body);
   user.findOne({email:req.body.email},function(err,u){
     if(err){
       res.json({success: false, message: 'Email is not correct.Please try again!'})
     }else{
     u.setPassword(req.body.new_password,function(err,u){
       if(err){
         res.json({success: false, message: 'Password could not be saved.Please try again!'})
       }
       else{
         //res.json({success: true, message: 'Your new password has been saved successfully'})
         u.save();
         res.redirect("/");
       }
     })
   }
 });
})
//Admin module


//Developer module

//Tester module

//server
app.listen(8484,function(){
  console.log("Server statred on  port 8484");
});
