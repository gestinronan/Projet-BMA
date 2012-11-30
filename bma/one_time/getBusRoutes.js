/******************
* filename: getBusRoutes.js
* data: 29/11/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
///// This Script Is only to save the bus route into the database /////////
///////////////////////////////////////////////////////////////////////////

// Connection to the database
var databaseUrl = "stops"; // "username:password@example.com/mydb"
var collections = ["busRoutes", "reports"]
var db = require("mongojs").connect(databaseUrl, collections);

// Jquery variable
var $ = require('jQuery');

// Useful to load the file
var fs = require('fs');

// Path of the file
var path = '/Users/guigui2287/Sites/bma/bma/gtfsData/routes.txt';

// Remove the data in the collection before adding some new data
//db.busStations.remove({});

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
			route_id = data[0];
			route_long_name = data[2];
			route_short_name = data[3];
			
			// Save the data into the database
			db.busRoutes.save({'route_id': route_id, 'route_long_name': route_long_name, 'route_short_name': route_short_name}, 
			
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
	
	// Leave the script
	console.log("Script Done");	
	process.exit(code=0);
}