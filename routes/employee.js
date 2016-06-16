var express = require('express');
var router = express.Router();
var passport = require('passport');
var Employee = require('../model/Employee');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
exports.getIndex = (req,res) => {
    Employee.find({}, function(err, employees) {
        if (err) throw err;
        res.render('employee/index',{"list":employees,"title": "Employee"});
    });
}

exports.getAdd = (req,res) => {
    res.render('employee/add',{"title":"Employee - Add"});
}

exports.postAdd = (req,res,next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('fullname', 'Username cannot be blank').notEmpty();
    req.assert('address', 'Username cannot be blank').notEmpty();
    req.assert('phone', 'Username cannot be blank').notEmpty();
    req.assert('phone', 'This has to be mobile format').isMobilePhone();    
    req.sanitize('email').normalizeEmail({ remove_dots: false });    
    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/employee/add');
    }
    var employee = new Employee({ 
        _id : new ObjectID(),
        fullname : req.body.fullname,
        address : req.body.address,
        phone : req.body.phone,
        email : req.body.email,
        gender : req.body.gender
    });    
    
        employee.save((err) => {
            if (err) { return next(err); }
            req.flash('success', { msg: 'Employee'+employee.fullname+'  has been add.' });
            res.redirect('/employee/index');
        });
      
}
