
/**
 * Fichier Serveur projet BMA
 */

/********* Variable utilisé par le serveur *********/

// Variable nécéssaire a la création du serveur
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

// Jquery variable
var $ = require('jQuery');

var app = express();

/********* Définition des API que l'on contact *******/

// Variable de contact pour le site de la star
var api_star = http.createClient(80, "http://data.keolis-rennes.com/json/");
var version = "2.0";
var key_star = "FR6UMKCXT1TY5GJ";

/****** Variable ********/
var data;

/********* Configuration du serveur ***********/

// Configuration du serveur 
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// TEST: Creation de l'url et appel ajax
var url = "http://data.keolis-rennes.com/json/?version=" + version + "&key=" + key_star + "&cmd=getbikestations";
getData(url);

/************* Get Request ********/

// This is the function which manage a get call on '/' (That's the first page which is load)
app.get('/',function(req, res){
	
	var xhr = $.ajax({
		
		// Parameter
		url: url, // Url uses to make the call
		dataType: 'json',  // Type of data we receive
		success: function(data){
			data = data;
			// Function call in case of success call.
			console.log(data.opendata);	
			for (i=0; i <data.opendata.answer.data.station.length; i++){
				console.log(data.opendata.answer.data.station[i]);
			}	
			
			res.render('index', {
				data: data
			})
		},
		error: function(){
			
			// Function call in case of error during the call.
		}
	});
	

});


/******** Post request **********/


// This is a post request (What the phone or the website will send us)
app.post('/android', function(req, res){
	
	// We first get the parameter sent in the request
	lng = req.body.lng; // Here we get the longitude
	lat = req.body.lat; // Here we get the latitude
	
	// Then we send what we want
});



/******* Création du serveur ********/

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


/********* Functions ***********/

// Get Ajax call function
function getData(url){
	
	// Appel vers le serveur
	var xhr = $.ajax({
		
		// Parameter
		url: url, // Url uses to make the call
		dataType: 'json',  // Type of data we receive
		success: function(data){
			data = data;
			// Function call in case of success call.
			console.log(data.opendata);	
			for (i=0; i <data.opendata.answer.data.station.length; i++){
				console.log(data.opendata.answer.data.station[i]);
			}	
		},
		error: function(){
			
			// Function call in case of error during the call.
		}
	});
}

