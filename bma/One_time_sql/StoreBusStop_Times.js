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
var $ = require('jquery');

// Useful to load the file
var fs = require('fs');

// Path to GTFS file containing the bus stops value (stops.txt)
var pathToData = "/Users/guillaumelefloch/Documents/workspace/Projet-BMA/bma/gtfsData_STAR/stop_times.txt";

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
		
	// Parse the half of the data except the first line (header)
    for (var i=1; i<allTextLines.length ; i++) {
        
		// Split the line
		var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
				
			// Save the data into the BusStops table
			var query = connection.query("INSERT INTO test.BusStop_times SET ?", {Trip_id: data[0], Stop_id: data[1], Arrival_time: data[3], 
				Departure_time: data[4], Stop_headsign: data[5]}, 
				function(err, result) {
			  
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
	
	// Parse the rest of the data except the first line (header)
    /*for (var i=allTextLines/2 ; i<allTextLines.length; i++) {
        
		// Split the line
		var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
				
			// Save the data into the BusStops table
			var query = connection.query("INSERT INTO test.BusStop_times SET ?", {Trip_id: data[0], Stop_id: data[1], Arrival_time: data[3], 
				Departure_time: data[4], Stop_headsign: data[5]}, 
				function(err, result) {
			  
					// Case there is an error
					if(err || !data){
						console.log("An error occured: " + err);
					} else {
						console.log("Bus stop time saved");
					}
				});
			//console.log(query);	
		}
	}*/
}



