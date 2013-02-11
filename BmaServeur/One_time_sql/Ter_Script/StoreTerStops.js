/******************
* filename: StoreTerStops.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
//////// This Script add each Ter stops in the  TerStops table ////////////
///////////////////////////////////////////////////////////////////////////


// Variables needed for the database connection
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');


// Jquery variable
var $ = require('jquery');

// Useful to load the file
var fs = require('fs');

// Variable ID
var idDef = "StopArea:OCE87471";

// Path to GTFS file containing the bus stops value (stops.txt)
var pathToData = "../../gtfsData_TER/stops.txt";

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
* This function creates add all the TerStops into the databases
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
			var stop_name = data[1];
			var stop_desc = data[2];
			var stop_lat = data[3];
			var stop_lon = data[4];
			
			
			// Before inserting the stops, we check if it's in ile et vilaine
			var partId = stop_id.substr(0, 17);


			if(partId == idDef){
				console.log('partId :: ' + partId + ' idDef :: ' + idDef);
				// Save the data into the BusStops table
			var query = connection.query("INSERT INTO test.TerStops SET ?", {Stop_id: stop_id, Stop_name: stop_name, 
				Stop_desc: stop_desc, Stop_lat: stop_lat, Stop_lon: stop_lon}, function(err, result) {
			  	
					// Case there is an error
					if(err || !data){
						console.log("An error occured: " + err);
					} else {
						console.log("TER stop saved :: " + x + "/" + allTextLines.length);

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
}