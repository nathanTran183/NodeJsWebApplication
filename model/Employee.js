var mongoose = require('mongoose');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;

// create a schema
var employeeSchema = new Schema({  
  _id: ObjectId,
  "fullname" : String,
  "address" : String,
  "phone" : String,
  "email" : String,
  "gender" : String,
  "department" :{
      type: mongoose.Schema.Types.ObjectId,
       ref: 'Department'
  }
},{collection : 'Employee'});

var Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;