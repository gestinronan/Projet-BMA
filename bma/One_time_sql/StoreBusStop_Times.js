/******************
* filename: StoreBusStop_Times.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
////// This Script add each bus trips in the  BusStop_times table /////////
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
var pathToData = "/Users/guigui2287/Documents/workspace/Projet-BMA/bma/gtfsData/stop_times.txt";

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
			var stop_id = data[1];
			var stop_sequence = data[2];
			var arrival_time = data[3];
			var departure_time = data[4];
			var stop_headsign = data[5];
			var pickup_type = data[6];
			var drop_off_type = data[7];
			var shape_dist_traveled = data[8];
				
			// Save the data into the BusStops table
			var query = connection.query("INSERT INTO test.BusStop_times SET ?", {Trip_id: trip_id, Stop_id: stop_id, Stop_sequence: stop_sequence, Arrival_time: arrival_time, 
				Departure_time: departure_time, Stop_headsign: stop_headsign, Pickup_type: pickup_type, Drop_off_type: drop_off_type, 
				Shape_dist_traveled: shape_dist_traveled}, function(err, result) {
			  	
					// Case there is an error
					if(err || !data){
						console.log("An error occured: " + err);
					} else {
						console.log("Bus stop time saved");
					}
				});
			//console.log(query);	
		}
	}
}



