/******************
* filename: StoreBusTrips.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
////// This Script add each bus Trips in the  BusStops table /////////////
///////////////////////////////////////////////////////////////////////////

// Variables needed for the database connection
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=true');

// Connection to the database
connection.connect(function(err){
	
	// Case there is an error during the connection
	if(err){
		console.log("Connection problem : " + err);
	} else
	console.log("Connection ok");	
});

// Jquery variable
var $ = require('jQuery');

// Useful to load the file
var fs = require('fs');

// Path to GTFS file containing the bus stops value (stops.txt)
var pathToData = "/Users/guillaumelefloch/Documents/workspace/Projet-BMA/bma/gtfsData_STAR/trips.txt";

// Load the text file
fs.readFile(pathToData, function (err, data) {
  
	// Case there is an error
  	if (err) {
	 	 console.log("File not load");
      	throw err; 
 	}
	 
	// Function that read the file and save the data 
	processData(data.toString());
});


/**
* This function parse the text file and save the data to the database
* @Parameter:
* Data: String that contain the data
*/

function processData(data){
    var allTextLines = data.split(/\r\n|\n/);
    
	// Get the header
	var headers = allTextLines[0].split(',');
		
	// Parse the data except the first line (header)
    for (var i=1; i<allTextLines.length; i++) {
        
		// Split the line
		var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
			
			// Get the data to save
			var trip_id = data[0];
			var service_id = data[1];
			var route_id = data[2];
			var trip_headsign = data[3];
			var direction_id = data[4];
			var block_id = data[5];
				
			// Save the data into the BusStops table
			var query = connection.query("INSERT INTO test.BusTrips SET ?", {Trip_id: trip_id, Service_id: service_id, Route_id: route_id, Trip_headsign: trip_headsign, Direction_id: direction_id, Block_id: block_id}, function(err, result) {
			  	
					// Case there is an error
					if(err || !data){
						console.log("An error occured: " + err);
					} else {
						console.log("Bus trip saved");
					}
				});
			//console.log(query);	
		}
	
}
}


