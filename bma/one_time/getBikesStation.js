/******************
* filename: getBikeStation.js
* data: 24/11/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
///// This Script Is only to save the bike station into the database //////
///////////////////////////////////////////////////////////////////////////

// Connection to the database
var databaseUrl = "stops"; // "username:password@example.com/mydb"
var collections = ["bikeStations", "reports"]
var db = require("mongojs").connect(databaseUrl, collections);

// Jquery variable
var $ = require('jQuery');

// Key for the API
var key_star = "FR6UMKCXT1TY5GJ";

$.ajax({
	url: "http://data.keolis-rennes.com/json/?version=2.0&key=" + key_star + "&cmd=getbikestations",
	dataType: 'json',
	success: function(data){
		
		// Once we have the data, we parse the JSON and add everything to the database
		var station = data.opendata.answer.data.station;
		
		for(i=0; i<station.length; i++){
			
			// Save the stop into the database
			db.bikeStations.save({ id: station[i].number, longitude: station[i].longitude, latitude: station[i].latitude, name: station[i].name }, 
			
			// This confirm if the stop is saved
			function(err, saved){
				
				// Case the stop is not saved
				if(err || !saved)
					console.log("Stop not saved");
				else console.log("Stop saved");
			});
		}
	},
	error: function(e){
		
	}
})