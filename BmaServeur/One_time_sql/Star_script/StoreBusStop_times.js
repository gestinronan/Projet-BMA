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
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Connection to the database
connection.connect(function(err){
	
	// Case there is an error during the connection
	if(err){
		console.log("Connection problem : " + err);
	} else
	console.log("Connection ok");	
});

var i = 0;

// Jquery variable
var $ = require('jquery');

// Useful to load the file
var fs = require('fs');

// Path to GTFS file containing the bus stops value (stops.txt)
var pathToData = "../../gtfsData_STAR/stop_times.txt";


var stream = fs.createReadStream(pathToData, {encoding: 'utf8'});

stream.on('data', function(data){
	console.log(i);
	saveData(data);
	i++;
});


/**
* This function remove quotes from data
*/

function replaceAll(txt, replace, with_this) {
	return txt.replace(new RegExp(replace, 'g'),with_this);
}

/**
* This function save the data into the database
*/ 

function saveData(data){


	// Split the data into an array
	stop_times = new Array();
	stop_times = data.split(',');

	// Remove quotes from arrival and departure time
	stop_times[3] = replaceAll(stop_times[3], '\"', '');
	stop_times[4] = replaceAll(stop_times[4], '\"', '');

	// Case it's the first line
	if(i==0){
		return;
	}

	var query = connection.query("INSERT INTO test.BusStop_times SET ?", {Trip_id: stop_times[0], Stop_id: stop_times[1], Arrival_time: stop_times[3], 
		Departure_time: stop_times[4], Stop_headsign: stop_times[5]}, 
		function(err, result) {

					// Case there is an error
					if(err || !data){
						console.log("An error occured: " + err);
					} else {
						console.log("Bus stop time saved :: " + i);
						
					}
				});
}