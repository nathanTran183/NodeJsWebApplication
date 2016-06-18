var express = require('express');
var router = express.Router();

/* GET home page. */
exports.index = (req, res, next) => {
    console.log(req.user);
    res.render('index', { title: 'Express' });
};