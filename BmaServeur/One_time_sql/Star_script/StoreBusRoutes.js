/******************
* filename: StoreBusRoutes.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
////// This Script add each bus Routes in the  BusStops table /////////////
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

// Path to GTFS file containing the bus stops value (routes.txt)
var pathToData = "../gtfsData_STAR/routes.txt";

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
    
    x =0;
	// Get the header
	var headers = allTextLines[0].split(',');
		
	// Parse the data except the first line (header)
    for (var i=1; i<allTextLines.length; i++) {
        
		// Split the line
		var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
			
			// Get the data to save
			var route_id = data[0];
			var agency_id = data[1];
			var route_short_name = data[2];
			var route_long_name = data[3];
			var route_desc = data[4];
			var route_type = data[5];
			var route_url = data[6];
			var route_color = data[7];
			var route_text_color = data[8];
				
			// Save the data into the BusStops table
			var query = connection.query("INSERT INTO test.BusRoutes SET ?", {Route_id: route_id, Agency_id: agency_id, Route_short_name: route_short_name, Route_long_name: route_long_name, Route_desc: route_desc, Route_type: route_type, Route_url: route_url, Route_color: route_color, Route_text_color: route_text_color}, function(err, result) {
			  	
					// Case there is an error
					if(err || !data){
						console.log("An error occured: " + err);
					} else {
						console.log("Bus route saved :: " + x + "/" + allTextLines.length);

						// Case the script is done
						if(x == allTextLines.length-1){
							process.exit(0);
						}
						x++;
					}
				});
			//console.log(query);	
		}
	
}
}


