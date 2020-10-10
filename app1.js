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

mongoose.connect("mongodb://localhost:27017/bugtrackingdb", { useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.set("useCreateIndex", true);

const employeeSchema = new mongoose.Schema({
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
    project: String,
});

employeeSchema.plugin(passportLocalMongoose);
const user = mongoose.model("user",employeeSchema);

passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

const bugSchema = new mongoose.Schema({
    bugId: {
      type: String,
      required: [true, "Please fill the details"],
      unique: true
    },
    projectId: {
      type: String,
      required: true,
      unique: true
    },
    project: {
        type : String
        //required : [true, "Please fill the details"]
    },
    category:{
        type : String,
    },
    severity : {
     type : String,
     enum : ['Low', 'Medium', 'High'],
    },
    status: {
        type: String,
        enum: ["to do", "in progress", "in review", "fixed"]
    },
    reportedBy:{
        type: String
    },
    assignedTo:{
        type: String
    },
    openedDate: {
      type: String
    },
    dueDate: {
       type: String
    },
    description:{
       type: String
    }
});

const bug = mongoose.model("bug",bugSchema);

const requestSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true},
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
})



const user1  = new user ({
    username: "Adm0001",
    name: "Gaurav Garg",
    email: "garggaurav460@gmail.com",
    contact: "9993041370",
    role: "admin",
    projects: "Bug Tracking",
    password: "password1"
});



user.find({},function(err, foundusers){
  if(foundusers.length === 0){
    user.register({name: user1.name,email: user1.email,contact:user1.contact,
    role:user1.role,username:user1.username}, user1.password, function(err,user) {
      if(err){
        console.log(err);
        res.redirect("/signup");
      }else{
        console.log("Admin has been added to the database.")
    }
    });
}
  else{
    console.log("Default users already added to the database");
  }
})

const request = mongoose.model("request",requestSchema);

//Global constants.
var role = "";

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

app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
})

app.post("/signup",function(req, res){
  console.log(req.body.fname);
  user.register({name: req.body.fname,email: req.body.email,contact:req.body.contact_no,
  role:req.body.role,username:req.body.username}, req.body.password, function(err,user) {
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
     console.log(req.user.role);
     role = req.user.role ;
     let page = "/" + req.user.role + "homepage"
     res.redirect(page);
    })
   }
  })
 });

app.post("/forgotpassword", function(req,res) {
   console.log(req.body);
   user.findOne({email:req.body.email},function(err,u){
     if(err){
       res.json({success: false, message: 'Email is not correct.Please try again!'});
       res.redirect("/forgotpassword");
     }else{
     u.setPassword(req.body.new_password,function(err,u){
       if(err){
         res.json({success: false, message: 'Password could not be saved.Please try again!'});
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
app.get("/bugslist",function(req,res){
  if(req.isAuthenticated()){
    res.render("bugslist");
  }else{
    res.redirect("/");
  }
})

//Developer module
app.get("/developerhomepage",function(req,res){
  if(req.isAuthenticated()){
    res.render("developerhomepage");
  }else{
    res.redirect("/");
  }
})
//Tester module
app.get("/testerhomepage",function(req,res){
  if(req.isAuthenticated()){
    console.log("running user list.");
    bug.find({},function(err, foundbugs){
      if(err){
        console.log(err);
      }
      else{
        console.log(foundbugs);
        console.log(req.user.name);
        res.render("testerhomepage",{bugslist:foundbugs,uname:req.user.name});
      }
   });
  }else{
    res.redirect("/");
  }
})

app.get("/reportbugtester",function(req,res){
  if(req.isAuthenticated()){
    res.render("reportbugtester");
  }else{
    res.redirect("/");
  }
})

app.post("/reportbugtester",function(req,res){
  console.log(req.body);
  console.log(req.user.name);
  const op = req.user.name;
  const bug1 = new bug({
    bugId:req.body.bugId,
    projectId:req.body.projectId,
    category:req.body.category,
    severity:req.body.severity,
    status:"to do",
    reportedBy:op,
    description:req.body.comment,
    openedDate:req.body.openDate,
    dueDate:req.body.dueDate
  })
  bug1.save();
  res.redirect("/testerhomepage");
})
app.post("/testerhomepage",function(req,res){

})
//server
app.listen(8484,function(){
  console.log("Server statred on  port 8484");
});
