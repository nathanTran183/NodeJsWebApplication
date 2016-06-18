var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/User');
var async = require('async');

exports.userIndex = (req,res) => {
    User.find({}, function(err, users) {
        if (err) throw err;
        res.render('userlist',{"userlist":users});
    });
}

exports.getlogin = (req,res) => {
    if (req.user) {
        console.log(req.user);
        return res.redirect('/');
    }
    return res.render('login',{"title":"Login"})
}

exports.postlogin = (req,res, next) => {
  req.assert('username', 'Username cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }
  passport.authenticate('local', (err, user, info) => {     
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      console.log("user.js: Khong ton tai user");
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      console.log("user.js: Dang nhap thanh cong");
      req.user = user;
      req.flash('success', { msg: 'Success! You are logged in.' });      
      return res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
  }

exports.logout = (req, res)=>{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  req.session.destroy(function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    res.redirect('/');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
};   

exports.getChangePassword = (req,res) =>{    
    if (req.user) {        
        return res.render('changepassword',{'title':'Change Password'});        
    }
    return res.redirect('login');
};
exports.postChangePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('currentpassword', 'Current Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/changepassword');
  }  
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    if(user.password != req.body.currentpassword){
        req.flash('errors',{msg: 'Current password is not matched!'});
        res.redirect('/changepassword');
    }        
    else{
        user.password = req.body.password;
        async.waterfall([
          function(callback) {
               user.save((err) => {
                 if (err) { return next(err); }
                 req.flash('success', { msg: 'Password has been changed.' });  
                 req.user
                 res.redirect('/');
                 callback(null, user.password);
               }); 
        },function(password,callback) {
            var newpassword = "This is how to use callback - async: " + password + "text";
            callback(null, newpassword);
        }], function(err, newPassword) {
            console.log(newPassword);
        });
    }
  });
};