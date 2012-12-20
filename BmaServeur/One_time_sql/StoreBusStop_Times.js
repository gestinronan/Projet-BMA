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


// Jquery variable
var $ = require('jquery');

// Variable needed to manage asynchronous function
var async = require('async');

// Useful to load the file
var fs = require('fs');

// Path to GTFS file containing the bus stops value (stops.txt)
var pathToData = "../gtfsData_STAR/stop_times.txt";

// Load the text file
fs.readFile(pathToData, function (err, data) {
  
	// Case there is an error
  	if (err) {
	 	 console.log("File not load");
      	throw err; 
 	}
    
    console.log("File Loaded");    

	// Function that read the file and save the data 
	processFirstHalfData(data.toString());
});


/**
 * Due to the size of the file, we have to add the data into the database in to times.
 * The first time we will add the first half of the data and the second time, we will add the
 * second half of data.
 *
 * The function processFirstHalfData will add the first part
 * The function processEndOfData will add the last part
 */



/**
* This function parse the text file and save the data to the database
* @Parameter:
* Data: String that contain the data
*/

// Declare the global variable
var allTextLines = null; // This will store all the data
var headers = null; // this contains the header

function processFirstHalfData(data){
    
    console.log("in process data");

    // Store the data into an array
    allTextLines = data.split(/\r\n|\n/);
    
    console.log(allTextLines.length);    
    console.log("data copied in allTextLines");

    // Get the header
    headers = allTextLines[0].split(',');
		
	// Parse the half of the data except the first line (header)
    for (var i=1; i< 40 ; i++) {
    
        console.log(i);        
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
						console.log("Bus stop time saved" + i);
					    if(i == 38){
                            processHalfOfData(allTextLines);
                        }
                    }
				});
			//console.log(query);	
		}
	}
	
}

/**
 * This function add the ast part of data into the database
 */

function processHalfOfData(allTextLines){
	

    // Taille de la boucle
    var jusqua = allTextLines.length * 2 / 3;


    // Parse the rest of the data except the first line (header)
    for (var i= 38  ; i < 80; i++) {
        
        console.log(i);

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
                        if(i == 78){
                            processEndOfData(allTextLines);
                        }
					}
                   
				});
			//console.log(query);
             
		}

    }
}

function processEndOfData(allTextLines){

    // Point de dÃpart de la boucle
    var aPartir = allTextLines.length * 2 / 3 - 2;
    
    
    // Parse the rest of the data except the first line (header)
    for (var i= 79 ; i < 120; i++) {
    
        console.log(i);
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
        }
    }
}
