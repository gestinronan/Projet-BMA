
/***************************
 * Fichier Serveur projet BMA
 * Date: 24/11/12
 * Version: 1.0
 * Author: Guillaume Le Floch
 * Contact: glfloch@gmail.com
 ***************************/

/********* Variable utilisé par le serveur *********/

// Variable nécéssaire a la création du serveur
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

// Jquery variable
var $ = require('jquery');

var app = express();

/********* Définition des API que l'on contact *******/

// Variable de contact pour le site de la star
var api_star = http.createClient(80, "http://data.keolis-rennes.com/json/");
var version = "2.0";
var key_star = "FR6UMKCXT1TY5GJ";

/****** Variable ********/
var data;

/******* Android varaible ****/
var androidLat, androidLng;

/********* Connection to the  mongodb Database *********/

var databaseUrl = "stops"; // "username:password@example.com/mydb"
var collections = ["bikeStations", "busStations", "metroStations", "reports"];
//var db = require("mongojs").connect(databaseUrl, collections);

/*********** Connection to the mysql Database ***********/

// Variables needed for the database connection
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Connection to the database
connection.connect(function(err){
	
	// Case there is an error during the connection
	if(err){
		console.log("Connection problem : " + err);
	} else
	console.log("Connection ok");	
});

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

/******* Création du serveur ********/

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


/************* Get Request for the bike stations ********/

// This is the function which manage a get call on '/' (That's the first page which is load)
app.get('/',function(req, res){
	
	var url = "http://data.keolis-rennes.com/json/?version=" + version + "&key=" + key_star + "&cmd=getbikestations";
	
	// Call the getData function
	getData(url, req, res, "bike");

});


/************* Get Request for the metro stations from mysql database ********/

app.get('/metro', function(req, res){
	
	// Get the data from the table Metro_Stop
	connection.query('SELECT * FROM MetroStops', function(err, result){
		
		// Pass the data to the metro template
		res.render('metro', {
			data: result
		})
	});
});

/*********** Get request for the bus Stations from the mysql database ***/
app.get('/bus', function(req, res){

    // Get the data from the BusStops table
    connection.query('SELECT * FROM BusStops', function(err, result){
    
        // Pass the data to the template
        res.render('bus', {
            data: result
        })
    });
});
/************ Example of an other get Request *****/

app.post('/android',function(req, res){
	
	console.log("Android get Request");
	
	
});

/******** Post request **********/


// This is a post request (What the phone or the website will send us)
app.post('/android/data', function(req, res){
	
	// We first get the parameter sent in the request
	androidLat = req.body.latitude; // Here we get the latitude
	androidLng = req.body.longitude; // Here we get the longitude
	
	// Display the response
	console.log("Longitude: " + androidLng);
	console.log("Latitude: " + androidLat);
	
	// Then we get the data 
	var url = "http://data.keolis-rennes.com/json/?version=2.0&key=" + key_star + "&cmd=getbikestations";
	getData(url, req, res, "android/data");	
});



/********** Android get Request ***********/

// This send the bike data to the android app
app.post('/android/data/bike', function(req, res){
	
	// Url to get the bike data
	var url = "http://data.keolis-rennes.com/json/?version=2.0&key=" + key_star + "&cmd=getbikestations";
	
	// Make an ajax request to the Keolis API
	getData(url, req, res, "android/data/bike");
	
});

// This send the bus data to the android app
app.post('/android/data/bus', function(req, res){
	
	// Get the data from the BusStops table
	connection.query('SELECT * FROM BusStops', function(err, result){
		
		// Write the data in the output
		res.send(result);
	});
});

// This send the train data to the android app
app.post('/android/data/train', function(req, res){
	
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
			//console.log(data.opendata);	
			
			// Case of a bike station
			if(type == "bike"){
				
				// Parse the Json
				for (i=0; i <data.opendata.answer.data.station.length; i++){
					//console.log(data.opendata.answer.data.station[i]);
				}	
				res.render('index', {
					data: data
				})	
			} 
			
			// Case of android without data 
			else if(type == "android/data/bike"){
				var station = data.opendata.answer.data.station;
				
				// Edit the Json and add a field which contains the distance between you and the stations
				for ( i=0; i < station.length; i++){

					// add the field distance into the json
					station[i].distance = '0';
				}
				
				res.send(data);
				
			}
			
			// Case of android with data
			else if(type == "android/data"){
				
				var station = data.opendata.answer.data.station;
				console.log("Longitude of the phone: " + androidLng);
				console.log("Latitude of the phone: " + androidLat);
				
				// We create a point with our coordinate
				//var myPos = Point(androidLat, androidLng);
				
				// Edit the Json and add a field which contains the distance between you and the stations
				for ( i=0; i < station.length; i++){
					
					// Call the getDistance function
					d = getDistance(station[i].latitude, station[i].longitude, androidLat, androidLng);
					
					/******* Use the node-module where *********/
					
					// Create the Geopoint of the stop
					//var bikeStation = Point(station[i].latitude, station[i].longitude);
					
					// then we calcul
					//myPos.distanceTo(bikeStation);
					/*******************************************/
					
					// add the field distance into the json
					station[i].distance = d;
				}
				res.send(data);
			}
		},
		error: function(){
			
			// Function call in case of error during the call.
		}
	});
}

/****** Function which calcul the distance between two points ******/ 

function getDistance(lat, lng, mylat, mylng){

	// Variable
	R = 6371; // Earth raduis in meters
	
	// Conversion to Radian
	lat = (lat * Math.pi) / 180;
	lng = (lng * Math.pi) / 180;
	mylat = (mylat * Math.pi) / 180;
	mylat = (mylat * Math.pi) / 180;
	
	
	// Math equation
	d = Math.acos(Math.sin(mylat)*Math.sin(lat)+Math.cos(mylat)*Math.cos(lat)*Math.cos(lng-mylng))*R
	
	// return the result
	return d;
	
}
