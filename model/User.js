var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;

// create a schema
var userSchema = new Schema({  
  _id: ObjectId,
  username:  String,
  password:  String ,
  email: String
},{collection : 'User'});

var User = mongoose.model('User', userSchema);

module.exports = User;