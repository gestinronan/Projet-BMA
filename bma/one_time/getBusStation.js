/******************
* filename: getBusStation.js
* data: 24/11/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
///// This Script Is only to save the bus stations into the database //////
///////////////////////////////////////////////////////////////////////////

// Connection to the database
var databaseUrl = "stops"; // "username:password@example.com/mydb"
var collections = ["busStations", "reports"]
var db = require("mongojs").connect(databaseUrl, collections);

// Jquery variable
var $ = require('jQuery');

// Useful to load the file
var fs = require('fs');

// Path of the file
var path = '/Users/guigui2287/Sites/bma/bma/gtfsData/stops.txt';

// Load the CSV file
fs.readFile(path, function (err, data) {
  
	// Case there is an error
  	if (err) {
	 	 console.log("File not load");
      	throw err; 
 	 }
	 
	 // Case the file is load
 	 console.log(data.toString());
	 processData(data.toString());
});


// Function which parse the CSV file and create a JSON Array
function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    
	// Get the header
	var headers = allTextLines[0].split(',');
		
	// Parse the data except the first line (header)
    for (var i=1; i<allTextLines.length; i++) {
        
		// Split the line
		var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
			
			// Get the data of the line
			stop_id = data[0];
			stop_name = data[2];
			stop_lat = data[4];
			stop_lon = data[5];
			
			// Save the data into the database
			db.busStations.save({'stop_id': stop_id, 'stop_name': stop_name, 'stop_lat': stop_lat, 'stop_lon': stop_lon}, // This confirm if the stop is saved
			// Callback function
			function(err, saved){
				
				// Case the stop is not saved
				if(err || !saved)
					console.log("Stop not saved");
				
				// Case it has been saved
				else console.log("Stop saved: ");
			});
        }
    }	
}