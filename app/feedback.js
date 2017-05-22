var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var User = require('./models/user');
var Feedback = require('./models/feedback-module');

var contactSchema = new mongoose.Schema({
  who:String,
  mobile:Number,
  contactEmail:String
});
var Contact = mongoose.model('contact', contactSchema);



var urlencodedParser = bodyParser.urlencoded({ extended: false });
 


module.exports=function(app){ 

    app.get('/about', urlencodedParser, function(req, res){
      User.count({},function(err, data){ 
    if(err) throw err;
    if(req.user){
    res.render('about', { users:data, user:req.user});
   } else{
    res.render('about', { users:data, user:'' });
   }
  });
  
    });

 app.get('/feedback',function(req, res){
   //res.end('OOps!  Error: 404');
   res.render('404');
 });

  app.post('/feedback', function(req, res){
   var newFeedback = Feedback(req.body).save(function(err, data){
      if (err) throw err;
      //res.json(data);
      res.render('feedback-success',{user:req.user});
    });
 });


   app.get('/contact',function(req, res){
    
     if(req.user){ 
          req.flash('errors','Contact our team here!');
          res.render('contact', { user:req.user, errors: req.flash('errors')});
     }
       else{
          res.render('contact', {user:'', errors: req.flash('errors') });
          }
 });

     app.post('/contact', function(req, res){
         if(req.user){
        var newContact = Contact(req.body).save(function(err, newData){
       if (err) throw err; 
          res.render('contact-success',{user:req.user, newData:newData});
    });
    }
    
     else {
         var newContact = Contact(req.body).save(function(err, newData){
       if (err) throw err;
          res.render('contact-success',{user:'', newData:newData});
    });
    
     }

 });

     


};