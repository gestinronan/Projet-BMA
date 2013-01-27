/******************
* filename: StoreBusStops.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
////// This Script add each bus stops in the  BusStops table /////////////
///////////////////////////////////////////////////////////////////////////

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

// Jquery variable
var $ = require('jquery');

// Useful to load the file
var fs = require('fs');

// Path to GTFS file containing the bus stops value (stops.txt)
var pathToData = "../gtfsData_STAR/stops.txt";

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

    var x = 1;
    
	// Get the header
	var headers = allTextLines[0].split(',');
		
	// Parse the data except the first line (header)
    for (var i=1; i<allTextLines.length; i++) {
        
		// Split the line
		var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
			
			// Get the data to save
			var stop_id = data[0];
			var stop_code = data[1];
			var stop_name = data[2];
			var stop_desc = data[3];
			var stop_lat = data[4];
			var stop_lon = data[5];
			var zone_id = data[6];
			var stop_url = data[7];
			var location_type = data[8];
			var parent_station = data[9];
			var stop_timezone = data[10];
			var wheelchair_boarding = data[11];

			
			stop_lat = replaceAll(stop_lat, '\"', '');
			stop_lon = replaceAll(stop_lon, '\"', '');
			stop_name = replaceAll(stop_name, '\"', '');

			// Save the data into the BusStops table
			var query = connection.query("INSERT INTO test.BusStops SET ?", {Stop_id: stop_id, Stop_code: stop_code, Stop_name: stop_name, 
				Stop_desc: stop_desc, Stop_lat: stop_lat, Stop_lon: stop_lon, Zone_id: zone_id, Stop_url: stop_url, Location_type: location_type,
				Parent_station: parent_station, Stop_timezone: stop_timezone, Wheelchair_boarding: wheelchair_boarding}, function(err, result) {
			  	
					// Case there is an error
					if(err || !data){
						console.log("An error occured: " + err);
					} else {
						console.log("Bus stop saved :: " + x + "/" + allTextLines.length);

						// case the script is done
						if(x == allTextLines.length - 1){
							process.exit(0);
						}
						x ++;
					}
				});
			//console.log(query);	
		}
	
}
}

function replaceAll(txt, replace, with_this) {
  return txt.replace(new RegExp(replace, 'g'),with_this);
}


