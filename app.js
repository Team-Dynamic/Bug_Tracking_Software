// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
var bugs = [];

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
        password : String,
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


//signup and login module

app.get('/',function(req,res){
  res.render("Login");
});

app.get('/signup',function(req,res){
  res.render("signup");
});

app.get('/forgotpassword',function(req,res){
  res.render('forgotpassword.ejs');
});


app.post('/forgotpassword',function(req,res){
    res.redirect('/');
});

app.post("/signup",function(req,res){
  console.log(req.body);
  let user5  = new user ({
      name: req.body.fname+req.body.lname,
      email: req.body.email,
      contact : req.body.contact_no
  });
  user5.save();
  //res.send("successful");
});

app.post('/',function(req,res){
  console.log(req.body);
  user.findOne({employee_Id: req.body.username }, function (err, docs) {
    if (err){
        req.flash()
        console.log(err)
    }
    else{
        console.log(docs);
        if(docs.password === req.body.password ){
          (docs.role == "Admin")? res.redirect("/userlist"):(docs.role ==="Developer")? res.redirect("/developer"):res.redirect("/tester");
        }else{
          //req.flash("error", "Your account or password is incorrect. Please try again or contact your system administrator!");
          res.redirect("/");
        }
    }
  });
});

//Admin module

app.get('/adduser',function(req,res){
  res.render("AddUser");
});

app.get('/requests',function(req,res){
  res.render("requests");
});


app.get('/userlist',function(req,res){
  console.log("running user list.");
  user.find({},function(err, foundusers){
    if(foundusers.length === 0){
      user.insertMany([user1, user2, user3], function(err){
      if (err){
        console.log(err);
      }
      else{
         console.log("Successful in adding default users.");
      }
    })
      res.redirect("/userlist");
    }
    else{
      //console.log(foundusers.length);
      res.render("Userlist",{userList:foundusers});
    }
 });
});

app.get('/bugslist',function(req,res){
  res.render('bugslist.ejs',{
      bugs : bugs
  });
});

app.post('/adduser',function(req,res){
  console.log(req.body.name);
  const var1 = req.body.eid;
  const var2 = req.body.name;
  const var3 = req.body.email;
  console.log(var3);
  const var4 = req.body.contact_no;
  const var5 = req.body.role;
  const var6 = req.body.password;
  console.log(var6);
  let user4  = new user ({
      employee_Id: var1,
      name: var2,
      email: var3,
      contact : var4,
      role : var5,
      project_assigned : "Bugs",
      password : var6,
  });

  user4.save();
  res.redirect("/userlist");
//res.send("You have added the user.")
});



//Tester module



app.get('/tester',function(req,res){
  res.render('tester.ejs');
});

app.post('/tester',function(req,res){
  const  bug = {
    project_id: req.body.project_id,
    category : req.body.category,
    severity: req.body.severity ,
    bug_id:req.body.bugid,
    due_date:req.body.due_date

    }

  bugs.push(bug);
  res.redirect('/bugslist');

});


// Developer module

app.get('/developer',function(req,res){
  res.render('developer.ejs');
});


// routing parameters

app.get("/bugslist/:BugId",function(req,res){
  const requestedtitle = _.lowerCase(req.params.BugId);

  bugs.forEach(function(bug){
    const storedtitle = _.lowerCase(bug.bug_id);

    if(storedtitle === requestedtitle){
      res.render("bugs",{
        title:bug.bug_id,
        project :bug.project_id,
        date : bug.due_date
      });
    }
  });
});

app.listen(8484,function(){
  console.log("Server statred on  port 8484")
});
