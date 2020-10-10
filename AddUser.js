const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/AddUser", { useNewUrlParser: true, useUnifiedTopology: true  });

const AddUserSchema = new mongoose.Schema({
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

const Employee = mongoose.model("Employee_data",AddUserSchema);

const Gaurav  = new Employee ({
    Employee_Id: 1,
    name: "Gaurav Garg",
    Email: "garggaurav460@gmail.com",
    contact : 9993041370,
    Roll : "Developer",
    Project_assigned : "Bug Tracking",


});
const pp  = new Employee ({
    Employee_Id: 1,
    name: "pp",
    Email: "garg460@gmail.com",
    contact : 9993041212,
    Role : "Tester",
    Project_assigned : "Bug Tracking system",


});

Employee.insertMany([Gaurav, pp], function(err)
{
if (err){
  console.log(err);
}
else{
   console.log("Successful");
}});     

Employee.deleteOne
({ name: 'Gaurav Garg' }, function (err) {});

Employee.deleteOne
({ name: 'pp' }, function (err) {});

