/******************
* filename: StoreBikeStops.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
////// This Script add each bikeStops in the  BikeStops table /////////////
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

// Key for the API
var key_star = "FR6UMKCXT1TY5GJ";

$.ajax({
	url: "http://data.keolis-rennes.com/json/?version=2.0&key=" + key_star + "&cmd=getbikestations",
	dataType: 'json',
	success: function(data){
		
		var x = 0;
		// Once we have the data, we parse the JSON and add everything to the database
		var station = data.opendata.answer.data.station;
		
		for(i=0; i<station.length; i++){
			
			// Save the stop into the database
			var stop_id = station[i].number;
			var lat = station[i].latitude;
			var lon = station[i].longitude;
			var name = station[i].name;
			
			connection.query("INSERT INTO test.BikeStops SET ?",{BikeStop_id: stop_id, BikeStop_name: name, BikeStop_lat: lat, BikeStop_lon: lon},function(err, result){
				// Case there is an error
				if(err || !data){
					console.log("An error occured: " + err);
				} else {
					console.log("Bike stop saved :: " + x + "/" + station.length);

					// Case the script is done
					if(x == station.length){
						process.exit(0);
					}
					x++;
				}
			});
		}
		
		// Leave the script
		console.log("Script Done");	
		//process.exit(code=0);
		
	},
	error: function(e){
		console.log("Script Failed");	
		//process.exit(code=0)
	}
})


