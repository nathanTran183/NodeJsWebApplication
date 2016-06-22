var express = require('express');
var router = express.Router();
var passport = require('passport');
var Employee = require('../model/Employee');
var Department = require('../model/Department')
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
exports.getIndex = (req,res) => {
    Employee.find({}).populate('department').exec(function(err, employees) {
        if (err) throw err;
        res.render('employee/index',{"list":employees,"title": "Employee"});
    });
}

exports.getDetails = (req,res) => {
    var id = req.param("id");
    Employee.findById(id).populate('department').exec((err, employee) => {
        if (err) { return next(err); }        
        console.log(employee);
        res.render('employee/details',{"employee":employee,"title": "Employee"});
    });
}

exports.getAdd = (req,res) => {
    Department.find({}, function(err, departments) {
        if (err) throw err;
        res.render('employee/add',{"list":departments,"title": "Employee"});
    });    
}
exports.postAdd = (req,res,next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('fullname', 'Employee name cannot be blank').notEmpty();
    req.assert('address', 'Employee address cannot be blank').notEmpty();
    req.assert('phone', 'Employee phone cannot be blank').notEmpty();    
    req.assert('phone','Phone length must be from 5 to 11').len(5,11);
//    req.assert('phone', 'This has to be mobile format').isMobilePhone();    
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
        gender : req.body.gender,
        department : req.body.department
    });    
    
    employee.save((err) => {
        if (err) { return next(err); }
        req.flash('success', { msg: 'Employee '+employee.fullname+' has been created!' });
        res.redirect('/employee/index');
    });
      
}

exports.getEdit = (req,res) => {
    var id = req.param("id");
    var flag = false;
    Department.find({}).populate('manager').exec((err, depList) => {
        if (err) throw err;        
        Employee.findById(id).populate('department').exec((err, employee) => {
            if (err) { return next(err); }        
            for(var i in depList){                    
                if(depList[i].manager!=null && depList[i].manager.id==id){
                    flag=true;
                    break;
                }
            }
            console.log(flag);
            res.render('employee/edit',{'title': 'Employee','employee': employee,'list':depList,'flag':flag});
        });
    });           
}
exports.postEdit = (req,res,next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('fullname', 'Employee name cannot be blank').notEmpty();
    req.assert('address', 'Employee address cannot be blank').notEmpty();
    req.assert('phone', 'Employee phone cannot be blank').notEmpty();    
    req.assert('phone','Phone length must be from 5 to 11').len(5,11);
//    req.assert('phone', 'This has to be mobile format').isMobilePhone();    
    req.sanitize('email').normalizeEmail({ remove_dots: false });    
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/employee/edit?id='+req.body.id);
    }
    
    Employee.findById(req.body.id, (err, employee) => {
        if (err) { return next(err); }
        employee.fullname = req.body.fullname,
        employee.address = req.body.address,
        employee.phone = req.body.phone,
        employee.email = req.body.email,
        employee.gender = req.body.gender,
        employee.department = req.body.department
        employee.save((err) => {
            if (err) {                
                return next(err);
            }
            req.flash('success', { msg: employee.fullname + ' Information has been updated!' });
            res.redirect('/employee/index');
        });
    });
}

exports.getDelete = (req,res) => {
    var id = req.param("id");    
    Employee.findById(id).populate('department').exec( (err, employee) => {
        if (err) { return next(err); }        
        res.render('employee/delete',{'employee': employee,'title':'Employee'});
    }); 
}
exports.postDelete = (req,res,next) => {
    Employee.remove({ _id: req.body.id }, (err) => {
        if (err) { return next(err); }        
        req.flash('errors', {msg:'Employee has been deleted!' });
        res.redirect('/employee/index');
  });
}