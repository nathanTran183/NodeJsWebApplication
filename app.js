var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport');
var flash = require('express-flash');
var expressValidator = require('express-validator');
//controller
var routes = require('./routes/index');
var employees = require('./routes/employee');
var users = require('./routes/users');
var departments = require('./routes/department');
//connect database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/EmployeeManagement');
var passportConfig = require('./config/passport');
var app = express();

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({
  secret : "secret",
  saveUninitialized: true,
  resave: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//Routes
app.get('/', routes.index);
app.get('/login', users.getlogin);
app.post('/login',users.postlogin);
app.get('/userIndex',passportConfig.isAuthenticated,users.userIndex);
app.get('/logout',users.logout);
app.get('/changepassword',passportConfig.isAuthenticated,users.getChangePassword);
app.post('/changepassword',users.postChangePassword);
//Employee
app.get('/employee/index',employees.getIndex);
app.get('/employee/details',employees.getDetails);
app.get('/employee/add',passportConfig.isAuthenticated,employees.getAdd);
app.post('/employee/add',employees.postAdd);
app.get('/employee/edit',passportConfig.isAuthenticated,employees.getEdit);
app.post('/employee/edit',employees.postEdit);
app.get('/employee/delete',passportConfig.isAuthenticated,employees.getDelete);
app.post('/employee/delete',employees.postDelete);
//Department
app.get('/department/index',departments.getIndex);
app.get('/department/details',departments.getEmployeeList);
app.get('/department/add',passportConfig.isAuthenticated,departments.getAdd);
app.post('/department/add',departments.postAdd);
app.get('/department/edit',passportConfig.isAuthenticated,departments.getEdit);
app.post('/department/edit',departments.postEdit);
app.get('/department/delete',passportConfig.isAuthenticated,departments.getDelete);
app.post('/department/delete',departments.postDelete);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
