module.exports = function(app, Schema, mongoose){
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
			key: 'user_sid',
			secret: 'Sdsd23da@#FWS4', 
			resave: false, 
			saveUninitialized: true,
			cookie: {expires: 600000}
		}
	));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
	if(req.cookies.user_sid && !req.session.user){
		res.clearCookie('user_sid');
	}else{
		res.locals.adminUser = req.session.user;
		res.locals.adminLogoutPath = req.baseUrl +'/admin/logout'
	}
	 next();
});



// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('admin/dashboard');
    } else {
				res.locals.adminUser = 'notLoggedIn';
        next();
    }    
};

var urlencodedParser = bodyParser.urlencoded({ extended: false });
	var personSchema = new Schema({
		firstname: String,
		lastname: String,
		username: String,
		password: String,
		address: String,	
	});
	var Person = mongoose.model('Person', personSchema);
	
	// Creating individual data documents, creating object of the Person function.
	// var admin = Person({
		// firstname: 'Pankaj',
		// lastname: 'Kumar',
		// username: 'admin',
		// password: '123456',
		// address: '55 main street, Delhi'
	// });
	
	app.set('layout', 'admin/layout');
	app.get('/admin', sessionChecker, function(req, res){
			var setData = {
				title: 'Login',
			};
			res.render('admin/admin_login', setData);
	});

	app.post('/admin', urlencodedParser, function(req, res){
		if (!req.body) return res.sendStatus(400);
		Person.find({username:req.body.username, password: req.body.password}, function(err, users){
			if(err) throw err;
			if(users != ''){
				req.session.user = users;
				return res.redirect(req.baseUrl +'admin/dashboard');
			}
			else
				return res.sendStatus(400);
		});
	});
	
	app.get('/admin/sign_up', function(req, res){
		// admin.save(function(err){
			// if(err) throw err;
			// console.log('Admin User saved');
		// });
		var setData = {
			title: 'Sign Up',
			// adminLogoutPath: req.baseUrl +'/admin/logout'
		};
		res.render('admin/admin_sign_up', setData);
	});
	
	app.get('/admin/logout', function(req, res){
		if(req.session.user && req.cookies.user_sid){
			res.clearCookie('user_sid');
			res.redirect(req.baseUrl+'/admin');
		}else{
			res.redirect(req.baseUrl+'/admin');
		}
	});
	
	app.get('/admin/dashboard', function(req, res){
		if(req.session.user && req.cookies.user_sid){
			var setData = {
				title: 'Dashboard',
				// adminLogoutPath: req.baseUrl +'/admin/logout'
			};
			res.render('admin/admin_dashboard', setData);
		}else{
			res.send('Invalid access !');
		}
	});
}