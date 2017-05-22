var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 

var User = require('./models/user');
var Invite = require('./models/Invite-module');
var Project = require('./models/Project-module');
var Photo = require('./models/photo-module');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
 


module.exports=function(app){ 

 app.get('/profile',function(req, res){

    if(req.user){
      Project.find({addedBy:req.user.google.email}, function(err, data){
            res.render('userProfile', { user:req.user,addedBy:data, errors:req.flash('errors')});
     
      })
    //res.render('userProfile', { data:req.session.user, errors:req.flash('errors')});

     }
       else{
    return res.redirect('/');
    }

 });

     app.post('/profile', function(req, res){

     User.findOne({'google.email':req.body.toUser}, function(err, existingUser){
    if(existingUser && req.body.fromUser != req.body.toUser){ 
        var newInvite = Invite(req.body).save(function(err, data){
        if (err) throw err;
         req.flash('errors', "Invited successfully!! " + req.body.toUser);
        return res.redirect('/profile')
        });

    } else if(req.body.fromUser == req.body.toUser){
       req.flash('errors', " you can't invite yourself ");
          return res.redirect('/profile')

    } else{
         console.log(req.body.toUser + " doesn't exists you can't invite");
          req.flash('errors', "doesn't exists you can't invite " + req.body.toUser);
          return res.redirect('/profile')
    }
  });


 });


   app.get('/networks',function(req, res){
     if(req.user){   
      Invite.find({toUser:req.user.google.email}, function(err, data){  
    if(err) throw err;
   
    res.render('myNetworks', { user:req.user, inviteUsers:data, errors:req.flash('errors')});
  
  });

     }
         else{
    return res.redirect('/login');
    }


 });



    app.post('/networks', function(req, res){
    Invite.findOne({fromUser : req.body.fromUser, toUser: req.user.google.email, rId: req.body.rId})
    .exec()
    .then((user) => {
      user.response = req.body.response
      user.save((err,data) => {
        console.log(err,data);
        return res.redirect('/networks');
      });

  });

 });


      app.get('/otherUser', function(req, res){
     if(!req.user){
    return res.redirect('/');
    } 
         
       if(!req.query.Enrollment){ 
      res.redirect('/networks')
       }

  User.findOne({'google.email':req.query.Enrollment}, function(err, data){  //Mool.find({}, function(err, data) =>will find all values
    if(err) throw err;
         res.render('otherUser', {qs:req.query, otherUser:data, user:req.user});
  });

   
 });


};