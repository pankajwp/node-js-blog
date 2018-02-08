module.exports = function(app, Schema, mongoose){	
	var bodyParser = require('body-parser');
	var moment = require('moment');
	var slugify = require('slugify');
	var urlencodedParser = bodyParser.urlencoded({ extended: false });
	
	var categorySchema = new Schema(
		{
			cat_name: String,
			cat_description: String
		},
		{
			timestamps: true
		}
	);
	var Category = mongoose.model('Category', categorySchema);
	
	
	var postSchema = new Schema(
		{
			title: {type: String, required: true, unique: true},
			slug: {type: String, required: true, unique: true},
			smallDesc: String,
			desc: String,
			cat_id: Number
		},
		{
			timestamps: true
		}
	);
	var Post = mongoose.model('Post', postSchema);
	
	app.set('layout', 'admin/layout');
	app.get('/admin/post', function(req, res){
		if(req.session.user && req.cookies.user_sid){
			var setData = { title: 'Post', moment:moment};
			if(req.query.alert)
				setData.alertMsg = 'Post added succesfully';
			Post.find({}, function(err, posts){
				if(err) throw err;
				if(posts !== '')
					setData.lists = posts;
				res.render('admin/admin_post', setData);
			});
		}else{
			res.send('Invalid access !');
		}
	});
	
	app.get('/admin/add_post', function(req, res){
		if(req.session.user && req.cookies.user_sid){
			setData = {title: 'Add Post'};
			if(req.query.alert == 'danger'){
				if(req.query.msg.indexOf('duplicate') !== -1){
					setData.alertMsg = 'A post with the same title already exists.';
				}
			}
			res.render('admin/admin_add_post', setData);
		}else{
			res.send('Invalid Access');
		}
	});
	
	app.get('/admin/edit_post', function(req, res){
		if(req.session.user && req.cookies.user_sid){
			setData = {title: 'Edit Post', slugify:slugify};
			if(req.query.post_id && req.query.post_id != ''){
				Post.findOne({_id: req.query.post_id}, function(err, post){
					if(err)throw err;
					setData.post = post;
					res.render('admin/admin_edit_post', setData)
				});
			}else{
				res.redirect(req.baseUrl+'/admin/post');
			}
		}else{
			res.send('Invalid Access');
		}
	});
	
	app.post('/admin/edit_post', urlencodedParser, function(req, res){
		if(req.session.user && req.cookies.user_sid){
			updatePost = {
				title: req.body.title,
				slug: slugify(req.body.slug),
				smallDesc: req.body.smallDesc,
				dec: req.body.desc
			};
			Post.findByIdAndUpdate(req.body.id, updatePost, {multi: false}, function(err){
				if(err) throw err;
				res.redirect(req.baseUrl+'/admin/post?alert=success');
			});
		}else{
			res.send('Invalid Access !');
		}
	});
	
	app.post('/admin/add_post', urlencodedParser, function(req, res){
		var savePost = Post({
			title: req.body.title,
			smallDesc: req.body.smallDesc,
			slug: slugify(req.body.title),
			desc: req.body.desc
		});
		
		savePost.save(function(err){
			if(err){
				var errMsg = err.errmsg.split(':');
				return res.redirect(req.baseUrl+'/admin/add_post?alert=danger&msg='+errMsg[0]);
			}
			else{
				return res.redirect(req.baseUrl+'/admin/post?alert=success');
			}
		})
		
	});
	
	app.get('/admin/categories', function(req, res){
		if(req.session.user && req.cookies.user_sid){
			var setData = { title: 'Category List', moment:moment};
			if(req.query.alert)
				setData.status = req.query.alert;
			if(req.query.alert == 'success')
				setData.statusMsg = 'Category added succesfully.';
			else if(req.query.alert == 'danger')
				setData.statusMsg = 'Unable to add category.';
			
			Category.find({},function(err, categories){
				if(err) throw err;
				setData.categories = categories;
				res.render('admin/admin_categories', setData);
			});
		}else{
			res.send('Invalid Access !');
		}
	});
	
	app.get('/admin/add_category', function(req, res){
		if(req.session.user && req.cookies.user_sid){
		var setData = {
				title: 'Category'				
			};
			res.render('admin/admin_add_category', setData);
		}else{
			res.send('Invalid Access !');
		}
	});
	
	
	app.post('/admin/add_category', urlencodedParser, function(req, res){
		var saveCat = Category({
			cat_name: req.body.cat_name,
			cat_description: req.body.cat_description
		});
		saveCat.save(function(err){
			if(err){
				return res.redirect(req.baseUrl+'/admin/categories?alert=danger');
			}else{
				return res.redirect(req.baseUrl+'/admin/categories?alert=success');
			}
		});
	});
	
}