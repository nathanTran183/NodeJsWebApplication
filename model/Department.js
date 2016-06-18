var mongoose = require('mongoose');
var Schema = mongoose.Schema,ObjectId = Schema.Types.ObjectId;
// create a schema
var departmentSchema = new Schema({  
  _id: ObjectId,
  "name" : String,  
  "officephone" : String,
  "manager": {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Employee'
  }
},{collection : 'Department'});

var Department = mongoose.model('Department', departmentSchema);

module.exports = Department;