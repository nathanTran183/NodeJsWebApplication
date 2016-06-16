var express = require('express');
var router = express.Router();

/* GET home page. */
exports.index = (req, res, next) => {
  res.render('index', { title: 'Express' });
};