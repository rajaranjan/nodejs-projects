var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

//single post
router.get('/show/:id',function(req,res,next){
	var posts = db.get('posts');
	posts.find({'_id':req.params.id},{},function(err,post){
		console.log(post);
		res.render('show',{
  		'post':post[0]
  		});
	});
});
//homepage blog post
router.get('/add', function(req, res, next) {
  var categories = db.get('categories');
  
  categories.find({},{},function(err,categories){
  	res.render('addpost',{
  		'title':'Add Post',
  		'categories':categories
  	});
  });
});
router.post('/addcomment', function(req,res,next){
	//get the form values
	var name = req.body.name;
	var email = req.body.email;
	var body = req.body.body;
	var postid = req.body.postid;
	var commentdate = new Date();
	//form validation
	req.checkBody('name','name Field is required').notEmpty();
	req.checkBody('email','email Field is required').notEmpty();
	req.checkBody('email','email Field is formatted properly').isEmail();
	req.checkBody('body','Body field is required').notEmpty();

	//check errors
	var errors = req.validationErrors();
	if (errors){
		var posts = db.get('posts');
		posts.find({'_id':postid},{},function(err,post){
			res.render('show',{
			'errors':errors,
	  		'post':post[0]
	  		});
		});
	}else{
		var comment = {"name":name,"email":email,"body":body,"commentdate":commentdate}
		var posts = db.get('posts');

		//submit to db
		posts.update({
			"_id":postid
			},
			{
				$push:{
					"comments":comment
				}
			},
			function(err,doc){
				if(err) {
					throw err;
				}else{
					req.flash('success','Comment Added');
					res.location('/posts/show/'+postid);
					res.redirect('/posts/show/'+postid);
				}
			}
		)
	}
});
router.post('/add', function(req,res,next){
	//get the form values
	var title = req.body.title;
	var category = req.body.category;
	console.log(category);
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();

	// if(req.files.mainimage){
	// 	var mainImageOriginalName = req.files.mainimage.originalname;
	// 	var mainImageName = req.files.mainimage.name;
	// 	var mainImageMime = 	req.files.mainimage.mimetype;
	// 	var mainImagePath = 	req.files.mainimage.path;
	// 	var mainImageExt = 	req.files.mainimage.extension;
	// 	var mainImageSize = 	req.files.mainimage.size; 
	// }else{
	// 	var mainImageName = 'noimage.png';
	// }
	var mainImageName = 'noimage.png';
	//form validation
	req.checkBody('title','Title Field is required').notEmpty();
	req.checkBody('body','Body field is required').notEmpty();

	//check errors
	var errors = req.validationErrors();
	if (errors){
		res.render('addpost',{
			'errors':errors,
			'title':title,
			'body':body
		});
	}else{
		var posts = db.get('posts');

		//submit to db
		posts.insert({
			'title':title,
			'body':body,
			'category':category,
			'date':date,
			'author':author,
			'mainimage':mainImageName
		},function(err,post){
			if (err){
				res.send('did not submit post');
			}else{
				req.flash('success','post submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});


module.exports = router;