var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'portofolio'
});

connection.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM portofolio',function(err,rows,fields){
  	if(err) throw err;
  	res.render('dashboard',{
  		"rows":rows,
  		layout:"layout2"
  	})
  })
});

router.get('/new',function(req,res,next){
	res.render('new');
})
router.post('/new',function(req,res,next){
	var title = req.body.title;
	var description = req.body.description;
	var service = req.body.service;
	var client = req.body.client;
	var projectdate = req.body.projectdate;

	//form validation
	req.checkBody('title','Title Field is empty').notEmpty();
	req.checkBody('service','Service Field is empty').notEmpty();

    var projectImageName = 'cabin.png';
	var errors = req.validationErrors();
	if(errors){
		res.render('new',{
			errors:errors,
			title:title,
			description:description,
			service:service,
			client:client
		});
	}else{
		var project = {
			title:title,
			description:description,
			service:service,
			client:client,
			date:projectdate,
			image:projectImageName
		};	
		var query = connection.query('INSERT INTO portofolio SET ?',project,function(err,result){
			//Project Inserted
			if(err) throw err;
		});
		req.flash('success','Project Added');
		res.location('/admin');
		res.redirect('/admin');
	}
});
module.exports = router;
