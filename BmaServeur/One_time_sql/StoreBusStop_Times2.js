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

// Jquery variable
var $ = require('jquery');

// Useful to load the file
var fs = require('fs');

// Path to GTFS file containing the bus stops value (stops.txt)
var pathToData = "../gtfsData_STAR/stop_times.txt";

// Global Variable
var allTextLines = null;
var headers = null;
var firstTier = new Array();  // This will contain the first Tiers of the data
var secondTier = new Array(); // This will contain the second Tiers of the data
var thirdTier = new Array(); // This will contain the third Tiers of the data


// Load the text file
fs.readFile(pathToData, function (err, data) {
  
	// Case there is an error
  	if (err) {
	 	 console.log("File not load");
 	}
	 

	allTextLines = data.toString().split(/\r\n|\n/); // Split the text into an array
	headers = allTextLines[0].split(','); // Get the first line

	// Now we can cut the array into three array

	// Fill the firstTier array
	var h = 0;

    // VAlue loop
    var apartir = allTextLines.length / 3;
    var jusqua = allTextLines.length *2 / 3;
	
    apartir = Math.round(apartir);
    jusqua = Math.round(jusqua);

    console.log(allTextLines.length);
    console.log(apartir);
    console.log(jusqua);
    
    for(i= apartir; i < jusqua; i++){
		//console.log(allTextLines[i]);
        
        firstTier[h] = allTextLines[i];
		h++;
	}

	console.log("FirstTier array filled: " + firstTier.length);

	// Fill the secondTier array
/*	var j = 0;
	for(i= allTextLines.length / 3; i < allTextLines.length * 2 / 3 ; i++){
		secondTier[j] = allTextLines[i];
		j ++;
	}*/

/*	console.log("SecondTier array filled: " + secondTier.length);

	// Fill the thirdTer array
	var k = 0;
	for(i= allTextLines.length * 2 / 3; i < allTextLines.length; i++){
		thirdTier[k] = allTextLines[i];
		k ++;
	}*/

	//console.log("ThirdTier array filled: " + thirdTier.length);
	
	// Once all arrays are fill, we call the process data function which will add the data into our database
    process.nextTick(function(){
        processData(firstTier);
     });
	//process.nextTick(function () {
    //	processData(secondTier);
   // });
	//process.nextTick(function(){
	//	processData(thirdTier);
	//});
	
});


/**
* This function parse an array and save the data to the database
* @Parameter:
* Data: String that contain the data
*/

function processData(array){

	var x = 0;
	// Parse the half of the data except the first line (header)
    for (var i=0; i < array.length ; i++) {
    
        console.log(array[i]);  
		// Split the line
		// Case there is no data in the row
		if(array[i] != undefined){
			var data = array[i].split(',');
    	    if (data.length == headers.length) {
				
				// Save the data into the BusStops table
				var query = connection.query("INSERT INTO test.BusStop_times SET ?", {Trip_id: data[0], Stop_id: data[1], Arrival_time: data[3], 
					Departure_time: data[4], Stop_headsign: data[5]}, 
					function(err, result) {
			  
						// Case there is an error
						if(err || !data){
							console.log("An error occured: " + err);
						} else {
							console.log("Bus stop time saved :: " + x + "/" + array.length);

							// Case the script is over
							if(x == array.length - 1){
								process.exit(0);
							}
							x++;
						}
					});
				//console.log(query);	
			}
		}
	}	
}



