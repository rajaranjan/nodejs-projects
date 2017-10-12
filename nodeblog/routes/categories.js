var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:category',function(req,res,next){
	var db = req.db;
	var posts = db.get('posts');
	posts.find({category:req.params.category},{},function(err,posts){
		res.render('index',{
  		'title':req.params.category,
  		'posts':posts
  		});
	})
});
//homepage blog post
router.get('/add', function(req, res, next) {
	 	res.render('addcategory',{
	  		'title':'Add Category'
	  	});
});

router.post('/add', function(req,res,next){
	//get the form values
	var title = req.body.title;

	req.checkBody('title','catgory Field is required').notEmpty();

	//check errors
	var errors = req.validationErrors();
	if (errors){
		res.render('addcategory',{
			'errors':errors,
			'title':title
		});
	}else{
		var categories = db.get('categories');

		//submit to db
		categories.insert({
			'title':title
		},function(err,category){
			if (err){
				res.send('did not submit categories');
			}else{
				req.flash('success','category submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;