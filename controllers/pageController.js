module.exports = function(app, Schema, mongoose){
	var moment = require('moment');	
	var postSchema = new Schema(
		{
			title: {type: String, unique: true},
			slug: {type: String, unique: true},
			smallDesc: String,
			desc: String
		},
		{
			timestamps: true
		}
	);
	var Post =  mongoose.model('Posts', postSchema);
	
	app.get('/', function(req, res) {
		var setData = {	
			title:'PankajWp | Node | Wordpress | CakePhp',
			layout: 'layout',
			moment: moment
		};
		Post.find({}, function(err, posts){
			if(err) throw err;
			if(posts !== '')
				setData.lists = posts;
			// console.log(setData);
			res.render('index', setData);
		});
	});
	
	app.get('/article/:slug', function(req, res){
		if(typeof req.params.slug !== 'undefined' && req.params.slug !== ''){
			singleData = {layout: 'layout'};
			Post.findOne({slug: req.params.slug}, function(err, postData){
				if(err) throw err
				// console.log(postData);
					singleData.post = postData;
					singleData.title = postData.title;
					res.render('single', singleData);
			});
		}else{
			res.send('Invalid Post');
		}
	})
	
	app.get('/about', function(req, res){
		var setData = {
			title:'About Us | PankajWp | Node | Wordpress',
			layout: 'layout'
		};
		res.render('about', setData);
	});

	app.get('/post', function(req, res){
		res.render('single-post', {title:'Blogs | PankajWp | Node | Wordpress',  layout: 'layout' });
	});

	app.get('/contact', function(req, res){
		res.render('contact', {title:'Contacts | PankajWp | Node | Wordpress',   layout: 'layout' });
	});
};