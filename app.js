var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@ds119736.mlab.com:19736/addressbook');


var Schema = mongoose.Schema;

app.use('/assests',express.static(__dirname + '/public'));
app.use(expressLayouts);

app.use((req, res, next) => {
		res.locals.baseUrl = req.baseUrl;
	 next();
});

// by default express will look for static files inside the filder called views
app.set('view engine', 'ejs');


// Controllers
var pageController = require('./controllers/pageController');
var postController = require('./controllers/postController');
var adminController = require('./controllers/adminController');
var randomController = require('./controllers/randomController');

randomController(app);
adminController(app, Schema, mongoose);
postController(app, Schema, mongoose);
pageController(app, Schema, mongoose);

// Listen
app.listen(port);
console.log('Listening on localhost:'+ port);