var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../model/User');
var bCrypt = require('bcrypt-nodejs');

passport.serializeUser(function(user, done) {    
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {    
    done(err, user);
}).catch(function (err) {
    console.log(err);
});
});

passport.use('local',new LocalStrategy({
     passReqToCallback: true
},(req,username, password, done) => {     
    User.findOne({ 'username' :  username,'password':password },(err, user) => {            
        if (err)
          return done(err,null);        
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, { msg: 'Wrong username or password!' });                 
        }
        else{            
            return done(null,user);
        }
//        user.comparePassword(password, (err, isMatch) => {        
//            console.log("Passport.js: Da vo dc so sanh");
//            if (isMatch) {            
//                console.log("Passport.js: Dang nhap thanh cong");                
//                return done(null, user);
//            }
//            console.log("Passport.js: sai mat khau");
//            return done(null, false, { msg: 'Invalid password.' });
//        });
    });
 }));

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
  console.log("Authenticated!");
    return next();
  }
  res.redirect('/login');
};

exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  if (_.find(req.user.tokens, { kind: provider })) {
  console.log("Authorized!");
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};

 
 