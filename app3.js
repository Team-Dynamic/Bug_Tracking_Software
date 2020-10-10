// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/bugProjectDB", { useNewUrlParser: true, useUnifiedTopology: true  });

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
    }
    project: {
        type : String,
        required : [true, "Please fill the details"]
    },
    category:{
        type : String,
    },
    severity : {
     type : String,
     enum : ['Low', 'Medium', 'High'],
    },
    status:
    {
        type: String,
        enum: ["to do", "in progress", "in review", "fixed"]
    },
    reportedBy :
    {
        type : addUserSchema
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


const bug1  = new bug({
    Bug_id: "abc123",
    Project: "Bug track",
    Category : "JLKAJLLFJL J LJLJDFabc",
    Severity : "Medium",
    Status: "In Progress",
    Reported_by : "Ayush",
    OpenedDate: "04-10-2020",
    DueDate : "05-10-2020"
});
const bug2  = new bug({
    Bug_id: "fgh1234",
    Project: "Bug track",
    Category : "abc",
    Severity : "Low",
    Reported_by : "Ayush",
    Status: "Done",
    OpenedDate: "02-10-2020",
    DueDate : "04-10-2020"});


/*bug.insertMany([bug1, bug2], function(err)
{
if (err){
  console.log(err);
}
else{
   console.log("Successful");
}});*/


//adduser schema



const addUserSchema = new mongoose.Schema({
    Employee_Id: Number,
    name: {
        type : String,
        required : [true, "Please fill the details"]
    },
    Email:{
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
    Role : {
     type : String,
     enum : ['Developer', 'Tester', 'Product Manager'],

    },
        Project_assigned : String,

});

const user = mongoose.model("user",addUserSchema);

const user1  = new user ({
    Employee_Id: 1,
    name: "Gaurav Garg",
    Email: "garggaurav460@gmail.com",
    contact : 9993041370,
    Roll : "Developer",
    Project_assigned : "Bug Tracking",


});
const user2  = new user ({
    Employee_Id: 1,
    name: "pp",
    Email: "garg460@gmail.com",
    contact : 9993041212,
    Role : "Tester",
    Project_assigned : "Bug Tracking system",


});

/*user.insertMany([user1, user2], function(err)
{
if (err){
  console.log(err);
}
else{
   console.log("Successful");
}});*/


// Request schema

const requestSchema = new mongoose.Schema({
    Name:
    {
        type : String,
        required : [true, "Please fill the details"]
    },

    Role :
    {
        type : String,
        enum : ['Developer', 'Tester', 'Admin'],
    },

    Username:
    {
        type : String,
        required : [true, "Please fill the details"]
    },

    Email_id:
    {
        type : String,
        //required : [true, "Please fill the details"]
        },

    contact_no:
    {
        type : String,
        validate:{
        validator: function(v) {
            return /\d{10}/.test(v);
                                },
         message: props => `${props.value} is not a valid phone number!`
                },
            required: [true, 'User phone number required']
    }
});

const request = mongoose.model("request",requestSchema);


const request1  = new request({
    Name: "Gaurav Garg",
    Role: "Developer",
    Username : "dev0001",
    Email_id: "grvgarg460@gmail.com",
    contact_no: 9993041370
});
const request2  = new request({
    Name: "Anant jain",
    Role: "Tester",
    Username : "dev0002",
    Email_id: "garg460@gmail.com",
    contact_no: 9993042542
});

/*request.insertMany([request1, request2], function(err)
{
if (err){
  console.log(err);
}
else{
   console.log("Successful");
}});*/

/*request.deleteOne({Username : "Adm00001"}, function(err){
  if(err){
    console.log(err);
  }else{
    console.log("deleted");
  }
});*/



const defaultusers = [user1];


//signup and login module

app.get('/',function(req,res){
  res.render("login");
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
  console.log(req.body.name);
  const var1 = req.body.name;
  const var2 = req.body.role;
  const var3 = req.body.username;
  const var4 = req.body.email_id;
  const var5 = req.body.contact_no;

  let request1  = new request ({
    Name: var1,
    Role: var2,
    Username : var3,
    Email_id: var4,
    contact_no: var5

  });

  request1.save();
  res.redirect("/signup");
});

app.post('/',function(req,res){
  console.log(req.body.username);
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

app.get('/assign',function(req,res){
  res.render("assign");
});

app.get('/usersrequests',function(req,res){

/*  user.find({},function(err, foundusers){
    if(foundusers.length === 0){
      user.insertMany([request1, request2, request3], function(err){
      if (err){
        console.log(err);
      }
      else{
         console.log("Successful in adding requests.");
      }
    })
      res.redirect("/userlist");
    }
    else{
      //console.log(foundusers.length);
      res.render("userlist",{userList:foundusers});
    }
 });*/
  res.render("usersrequests");

});


app.get('/userlist',function(req,res){
  console.log("running user list.");

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
