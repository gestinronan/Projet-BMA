
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

/*********** Connection to Databases ***********/

// Variables needed for the database connection
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Connection Neo4j database
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

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

// This is a post request from the phone to get the next departure for a bus
app.post('/android/nextdeparture', function(req, res){

	// Get the bus ID from the post request
	stopId = req.body.stopId;

	// Url to get the next departure 
	var url = "http://data.keolis-rennes.com/json/?cmd=getbikestations&version=2.1&key=" + key_star + "&param%5Bmode%5D=stop&param%5Bstop%5D%5B%5D=" + stopId;
});

/********** Android get Request ***********/

// This send the bike data to the android app
app.get('/android/data/bike', function(req, res){
	
	// Url to get the bike data
	var url = "http://data.keolis-rennes.com/json/?version=2.0&key=" + key_star + "&cmd=getbikestations";
	
	// Make an ajax request to the Keolis API
	getData(url, req, res, "android/data/bike");
	
});

// This send the bus data to the android app
app.get('/android/data/bus', function(req, res){
	
	// Get the data from the BusStops table
	connection.query('SELECT Stop_name, Stop_lat, Stop_lon, Line_short_name FROM BusStops', function(err, result){
		
		// Write the data in the output
		for(i=0; i< result.length; i++){
			result[i] = result[i].replace(/(\r\n|\n|\r)/gm,"");
		}
		
		res.send(result);
	});
});

app.get('/android/data/metro', function(req, res){

	// Database query
	connection.query('SELECT * FROM MetroStops', function(err, result){
		
		// Send the data
		res.send(result);
	})
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

			// Case the app request the next departure for a busStop
			else if(type == "android/nextdeparture"){
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

/**
* Function which update the bike node in the graph.
*/
function upDateBikeNode(){

	// Variable
	var idArray; // Variable to store nodeID and BikeID
	var i = 0; // Iterator

	// We get the nodeId from the sql database
	var query = query.connection('SELECT * FROM test.BusStops');
	query
	.on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
	})
	.on('fields', function(fields) {
    // the field packets for the rows to follow
	})
	.on('result', function(row) {

  		// Store data from the database into idArray variable (store the BikeStop_id and the NodeId)
  		idArray[i] = {BikeStop_id: row.BikeStop_id, NodeId: NodeId};

    })
	.on('end', function() {

		// We get the bike data from the keolis API
		var url = "http://data.keolis-rennes.com/json/?version=2.0&key=" + key_star + "&cmd=getbikestations"
		$.ajax({
			url: url,
			dataType: "json",
			success: function(data){

				// We update the bike node by adding the number of slot and bike available

				// First parse the idArray
				for(j=0; j<idArray.length; j++){

					// We parse the response
					var station = data.opendata.answer.data.station;
					for(k=0; k < station.length; k++){
						
						// We check if the bike stop of our if the same as the one in the response. 
						// if it's the case we update the node
						if(idArray[j].BikeStop_id == station[k].number){

							// In this case we update neo4j node
							db.updateNode(idArray[j].NodeId, {BikesAvailable: station[k].bikesavailable, SlotsAvailable: station[k].slotsavailable},

								// Callback
								function(err, node){

									// Case of error when updating the node
									if(err){
										console.log('An error occured: ' + err);
									} else {
										console.log('BikeStops updated!');
									}
								});

						}
					}
				}
			},
			error: function(err){
				
				// Case of error 
				console.log('An error occured during the ajax call');
			}
		});
	});
}
