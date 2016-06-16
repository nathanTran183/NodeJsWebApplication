var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/User');

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