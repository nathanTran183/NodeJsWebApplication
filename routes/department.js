var express = require('express');
var router = express.Router();
var passport = require('passport');
var Department = require('../model/Department');
var Employee = require('../model/Employee');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

exports.getIndex = (req,res) => {    
    Department.find({}).populate('manager').exec(function(error, list) {              
        res.render('department/index',{"list":list,"title": "Department"});
    });    
};

exports.getEmployeeList = (req,res) => {
    var id = req.param("id");
    var name = 'none';
    Department.findById(id, (err, department) =>{
        if (err) { return next(err); }
        name = department.name;
    });
    Employee.find({ "department": id }).populate('department').exec((err, empList) => {
        if (err) throw err;    
        res.render('department/details',{'list':empList,'title':"Department",'department':name});
    });
}

exports.getAdd = (req,res) =>{
    Employee.find({}, function(err, employees) {
        if (err) throw err;        
        res.render('department/add',{"title":"Department",'empList':employees});
    });    
}
exports.postAdd = (req,res,next) => {    
    req.assert('name', 'Office name cannot be blank!').notEmpty();    
    req.assert('officephone', 'Office phone cannot be blank!').notEmpty(); 
    req.assert('officephone', 'Office phone lenght is from 5 to 11!').len(5,11); 
    const errors = req.validationErrors();    
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/department/add');
    }
    var department = new Department({ 
        _id : new ObjectID(),
        name : req.body.name,        
        officephone : req.body.officephone,
        manager : null,        
    }); 
    Department.findOne({'name': req.body.name},(err,flag)=>{
        if(flag!=null){
            req.flash('errors', {msg: 'Department is already existed!'});
            res.redirect('/department/add');
        }
        else{
            department.save((err) => {
            if (err) { return next(err); }
            req.flash('success', { msg: 'Department '+department.name+' has been created!' });
            res.redirect('/department/index');
            });
        }
    })  
}

exports.getEdit = (req,res) => {
    var id = req.param("id");
    Employee.find({ "department": id }).populate('department').exec((err, empList) => {
        if (err) throw err;        
        Department.findById(id).populate('manager').exec((err, department) => {
            if (err) { return next(err); }       
            console.log(empList);
            res.render('department/edit',{'title': 'Department','department': department,'list':empList});
    });
    });           
}
exports.postEdit = (req,res,next) => {
    req.assert('name', 'Username cannot be blank').notEmpty();
    req.assert('officephone', 'Office phone cannot be blank').notEmpty();  
    req.assert('officephone', 'Office phone lenght is from 5 to 11!').len(5,11); 
//    req.assert('phone', 'This has to be mobile format').isMobilePhone();      
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        console.log(req.body.id);
        return res.redirect('/department/edit?id='+req.body.id);
    }
    
    Department.findById(req.body.id, (err, department) => {
        if (err) { return next(err); }
        department.name = req.body.name,        
        department.officephone = req.body.officephone,
        department.manager = req.body.manager
        department.save((err) => {
            if (err) {                
                return next(err);
            }
            req.flash('success', { msg: department.name + ' Information has been updated!' });
            res.redirect('/department/index');
        });
    });
}

exports.getDelete = (req,res) => {
    var id = req.param("id");    
    Department.findById(id).populate('manager').exec( (err, department) => {
        if (err) { return next(err); }        
        res.render('department/delete',{'department': department,'title':'Department'});
    }); 
}
exports.postDelete = (req,res,next) => {
    Department.remove({ _id: req.body.id }, (err) => {
        if (err) { return next(err); }        
        req.flash('errors', { msg:'Department has been deleted!' });
        res.redirect('/department/index');
  });
}

