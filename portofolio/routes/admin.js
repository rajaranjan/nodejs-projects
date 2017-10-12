var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection;
function handleDisconnect() {
	connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'root',
		database:'portofolio'
	});
	connection.connect(function(err) {              // The server is either down
	    if(err) {                                     // or restarting (takes a while sometimes).
	      console.log('error when connecting to db:', err);
	      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
	    }                                     // to avoid a hot loop, and to allow our node script to
	  });                                     // process asynchronous requests in the meantime.
	                                          // If you're also serving http, display a 503 error.
	connection.on('error', function(err) {
	    console.log('db error', err);
	    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
	      handleDisconnect();                         // lost due to either server restart, or a
	    } else {                                      // connnection idle timeout (the wait_timeout
	      throw err;                                  // server variable configures this)
	    }
	});
}
handleDisconnect();
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
	console.log(title);
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
			"title":title,
			"description":description,
			"service":service,
			"client":client,
			"date":projectdate,
			"image":projectImageName
		};	
		connection.query('INSERT INTO portofolio SET ?', project,function(err,result){
			//Project Inserted
			if(err){
				console.log(err);	
			}
		});
		req.flash('success','Project Added');
		res.location('/admin');
		res.redirect('/admin');
	}
});
router.get('/edit/:id', function(req, res, next) {
  connection.query('SELECT * FROM portofolio WHERE id ='+req.params.id,function(err,row,fields){
  	if(err) throw err;
  	console.log(row[0]);
  	res.render('edit',{
  		"row":row[0],
  		layout:"layout2"
  	})
  })
});
router.post('/edit/:id',function(req,res,next){
	var title = req.body.title;
	var description = req.body.description;
	var service = req.body.service;
	var client = req.body.client;
	var projectdate = req.body.projectdate;
	console.log(title);
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
			"title":title,
			"description":description,
			"service":service,
			"client":client,
			"date":projectdate,
			"image":projectImageName
		};	
		connection.query('UPDATE portofolio SET ? WHERE id ='+req.params.id, project,function(err,result){
			//Project Inserted
			if(err){
				console.log(err);	
			}
		});
		//req.flash('success','Project Updated');
		res.location('/admin');
		res.redirect('/admin');
	}
});
router.delete('/delete/:id', function(req, res) {
  connection.query('DELETE FROM portofolio WHERE id ='+req.params.id,function(err,result){
  	if(err) throw err;
  	//req.flash('success','Deleted Successfully');
  	res.location('/admin');
  	res.redirect('/admin');
  })
});

module.exports = router;
