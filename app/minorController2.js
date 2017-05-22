var express=require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var app = express();

var User = require('./models/user');
var Photo = require('./models/photo-module');
var Feedback = require('./models/feedback-module');
var Rating = require('./models/Rating-module');


var urlencodedParser = bodyParser.urlencoded({ extended: false });


var multer = require('multer');
var upload = multer({dest: 'minor/assets/uploads'})
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
})



module.exports=function(app){ 


   app.get('/', function(req, res, next){
 
           Feedback.find({},function(err,feedback){
            Rating.aggregate([
                     { $match: { } },
                     { $group: { _id:{pId:"$pId", projectTitle:"$projectTitle"}, total: { $avg:"$star"} } },
                     { $sort: { total:-1 }}
                   ], function(err,rating){
          res.render('main_page', {user:req.user,feedback:feedback,rating:rating,errors:req.flash('errors')});
        });
        })
   
  
   
  });

   app.get('/help', function(req, res, next){
         req.flash('errors','welcome to login-session');
          res.render('help', { user:req.user, errors: req.flash('errors')});
  });
 

 
   app.post('/basicInfo', urlencodedParser, function(req, res, next){
 
    User.findOne({'google.email':req.user.google.email})
    .exec()
    .then((User) => {
      User.github = req.body.github,
      User.facebook = req.body.facebook,
      User.mob = req.body.mob
      User.save((err,data) => {
        console.log(err,data);
        return res.redirect('/profile');
      });

  });
        
    });


};