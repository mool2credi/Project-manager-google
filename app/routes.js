var User = require('./models/user');
module.exports = function(app, passport){
/*	app.get('/glogin', function(req, res){
		res.render('glogin.ejs');
	});


	app.get('/gprofile', isLoggedIn, function(req, res){
		res.render('gprofile.ejs', { user: req.user });
	}); */

	app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

	app.get('/auth/google/callback', 
	  passport.authenticate('google', { successRedirect: '/',
	                                      failureRedirect: '/profile' }));

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}