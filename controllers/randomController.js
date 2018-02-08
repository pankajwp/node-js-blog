var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
module.exports = function(app){
	
	app.get('/api', function(req, res){
	res.json({firstname:'pankaj', lastname:'kumar'});
	});

	app.get('/person/:id', function(req, res){
		res.render('person', {ID: req.params.id, Qstr: req.query.qstr});
	});

	app.get('/form', function(req, res){
		res.render('form');
	})

	app.post('/person', urlencodedParser, function(req, res){
		res.send({firstName: req.body.firstname, lastname: req.body.lastname});
	});
	
}