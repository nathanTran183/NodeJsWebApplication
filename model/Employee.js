var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;

// create a schema
var employeeSchema = new Schema({  
  _id: ObjectId,
  "fullname" : String,
  "address" : String,
  "phone" : String,
  "email" : String,
  "gender" : String
},{collection : 'Employee'});

var Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;