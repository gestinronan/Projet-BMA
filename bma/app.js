
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

/************* Get Request for the bike stations ********/

// This is the function which manage a get call on '/' (That's the first page which is load)
app.get('/',function(req, res){
	
	var url = "http://data.keolis-rennes.com/json/?version=" + version + "&key=" + key_star + "&cmd=getbikestations";
	
	// Call the getData function
	getData(url, req, res, "bike");

});

/************* Get Request for the metro stations ********/

app.get('/metro', function(req, res){
	
	// Url fir the call
	var url = "http://data.keolis-rennes.com/json/?version=2.0&key=" + key_star + "&cmd=getmetrostations";
	
	// Call the getData function
	getData(url, req, res, "metro");
	
});


/************* Get Request for the bus stations ********/

app.get('/bus', function(req, res){
	
	// Url fir the call
	var url = "http://data.keolis-rennes.com/json/?version=1.0&key=" + key_star + "getstation&param[request]=all";
	
	// Call the getData function
	getData(url, req, res, "bus");
	
});




/************ Example of an other get Request *****/

app.get('/android',function(req, res){
	var url = "http://data.keolis-rennes.com/json/?version=1.0&key=" + key_star + "&cmd=getbikestations";
	
	
	
	var xhr = $.ajax({
		
		// Parameter
		url: url, // Url uses to make the call
		dataType: 'json',  // Type of data we receive
		success: function(data){
			
			// Function call in case of success call.
			console.log(data.opendata);	
			
			// We parse the Json response
			for (i=0; i <data.opendata.answer.data.station.length; i++){
				console.log(data.opendata.answer.data.station[i]);
			}	
			
			// Send the json data to the phone
			res.write(data);
		},
		error: function(e){
			
			// Function call in case of error during the call.
			res.write(JSON.stringify({ 'error': e }));
			res.end();
		}
	});
	

});


/******** Post request **********/


// This is a post request (What the phone or the website will send us)
app.post('/android', function(req, res){
	
	// We first get the parameter sent in the request
	lng = req.body.longitude; // Here we get the longitude
	lat = req.body.latitude; // Here we get the latitude
	
	// Display the response
	console.log("Longitude: " + longitude);
	condole.log("Latitude: " + latitude);
	
	// Then we send what we want
	res.write(JSON.stringify({'response': 'ok'}));
	res.end();
});



/******* Création du serveur ********/

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


/********* Functions ***********/

// Get Ajax call function, Maybe we will need to add an other parameter 
// to select wether or not we are sending Json or a template.
// Type correspond to the template we are using
function getData(url, req, res, type){
	
	// Appel vers le serveur
	var xhr = $.ajax({
		
		// Parameter
		url: url, // Url uses to make the call
		dataType: 'json',  // Type of data we receive
		success: function(data){
			data = data;
			// Function call in case of success call.
			console.log(data.opendata);	
			
			
			// Case of a bike station
			if(type == "bike"){
				
				// Parse the Json
				for (i=0; i <data.opendata.answer.data.station.length; i++){
					console.log(data.opendata.answer.data.station[i]);
				}	
				res.render('index', {
					data: data
				})	
			} 
			
			// Case of metro 
			else if(type == "metro"){
				
				for (i=0; i <data.opendata.answer.data.station.length; i++){
					console.log(data.opendata.answer.data.station[i]);
				}	
				res.render('metro', {
					data: data
				})
			} 
			
			// Case of bus
			else if(type == "bus"){	
				
				for (i=0; i <data.opendata.answer.data.station.length; i++){
					console.log(data.opendata.answer.data.station[i]);
				}	
				res.render('bus', {
					data: data
				})
			}
			
			// Case of android
			else if(type == "android"){
				
			}
		},
		error: function(){
			
			// Function call in case of error during the call.
		}
	});
}

