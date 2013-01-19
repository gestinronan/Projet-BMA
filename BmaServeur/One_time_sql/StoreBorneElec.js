/******************
* filename: StoreBorneElec.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
////// This Script add each electric borne to the database /////////
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

// Path to GTFS file containing the borne electrique file
var pathToData = "../Data_BorneElectrique/borne_vehicule_electrique.txt";

// Global Variable
var allTextLines = null;
var headers = null;


// Load the text file
fs.readFile(pathToData, function (err, data) {
  
	// Case there is an error
  	if (err) {
	 	 console.log("File not load");
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
	var x = 1;
    var allTextLines = data.split(/\r\n|\n/);
    console.log (allTextLines);
	// Get the header
	var headers = allTextLines[0].split(';');
		
	// Parse the data except the first line (header)
    for (var i=1; i<allTextLines.length; i++) {
        
		// Split the line
		var data = allTextLines[i].split(';');
        if (data.length == headers.length) {
			
			// Get the data to save
			var id = data[0];
			var name = data[1];
			var site_type = data[2];
			var acces = data[3];
			var tarif = data[5];
			var borne_type = data[6];
			var latitude = data[17];
			var longitude = data[16];
				
			// Save the data into the BusStops table
			var query = connection.query("INSERT INTO test.BorneElec SET ?", {BorneStop_id: id, BorneStop_name: name, BorneStop_site_type: site_type, BorneStop_acces: acces, BorneStop_tarif: tarif, BorneStop_type: borne_type, BorneStop_lat: latitude, BorneStop_lon: longitude}, function(err, result) {
			  	
					// Case there is an error
					if(err || !data){
						console.log("An error occured: " + err);
					} else {
						console.log("Borne elec saved :: " + x + "/" + 15);

						// Case last BorneElec
						if(x == 15){
							process.exit(0);
						}
						x++;
					}
				});
			//console.log(query);	
			
		}
	
}
}








