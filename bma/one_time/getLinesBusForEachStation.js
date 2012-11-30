/******************
* filename: getBusLinesForEachStation.js
* data: 29/11/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
/////// This Script add which line go in which bus stop ///////////////////
///////////////////////////////////////////////////////////////////////////

// Connection to the database
var databaseUrl = "stops"; // "username:password@example.com/mydb"
var collections = ["busStations", "busStopTimes", "busRoutes", "busTrips", "reports"]
var db = require("mongojs").connect(databaseUrl, collections);

// Jquery variable
var $ = require('jQuery');

// Data variables
var stops = new Array();
var trip_id = new Array();
var route_id;
var lines = new Array();

// Get All the Stops_id from the 
db.busStations.find().toArray(function(err, data){
	
	// Copy all the stops_id in our array
	stops = data;
	
	// Call the function that query the database to get the lines
	getDataFromDatabase(stops)
});

/**
* Function which query the database and get the routeid corresponding of the stop_id
* Parameter:
* stops_id:[] Array that contains all the stops_id
*/

var i = 0;
var stops_id;

function getDataFromDatabase(array){
	
	// Variables declaration and initialisation
	var stops_id = array;
	
	
	// Go through all the stops
	for(i=0; i < stops_id.length ; i++){
	
		var lines;
		var current_stop_id = stops_id[i].stop_id;

		// Call the getTrips function
		getTrips(current_stop_id);
	}
}

/**
* This function get the Trip_id for which go with the stopId
*/

function getTrips(stop_id){
	
	// Make a query to the busStopTimes collection and get the Trip_id
	db.busStopTimes.find({"stop_id" : stop_id }).toArray(function(err, data){
			
		// Case an error Occured during the call
		if(err || !data){
			console.log("An error Occured");
		
		// Case there is data
		} else {
				
			// Case there is more than one trip_id for a stop_id
			if(data.length > 1){
				for(i=0; i< data.length; i++){
				
					// For each trip_id, we find the route_id
					getRoutes(data[i].trip_id, stop_id);
				
				}
			
			// Case there is only one trip_id for the stop_id	
			} else {
			
				// Call the method to get the route_id
				//getRoutes(data[0].trip_id, stop_id);
			}
		}	
	});
}

/**
* This function get the route_id corresponding to the trip_id
* then the data is saved in the database calling the method save()
* @parameters:
* trip_id: id of the current trip
* stop_id: id of the current stop
**/


function getRoutes(trip_id, stop_id){
	
	// Check if the trip_id exist
	if(trip_id){
		db.busTrips.find({"trip_id" : trip_id}).toArray(function(err, data){
			
			// Case an error Occured during the call
			if(err || !data){
				console.log("An error Occured");
			}
			
			// Once we have the route_id and the stop_id, we can get the line name for one bus stop

			// Then we get the data from the busRoutes table
			getRoutesData(data[0].route_id, stop_id);
			
			// DEBUG
			console.log("Stop_id: " + stop_id + " Trips_id : " + trip_id + " Route_id : " + data[0].route_id );
		});
	}
}

/**
* This function get the data to save in the database
* @Parameter:
* stop_id: Bus stop to update
* route_id: Line that correspond to the stop_id
*/

function getRoutesData(route_id, stop_id){
	
	// Get the data of the line thanks to the route_id
	db.busRoutes.find({}).toArray(function(err, data){
		
		// Case there is no result for this query
		if(err || !data){
			console.log("An error occured getting the route informations");
		}
		
		// Then we save the data
		checkData(data, stop_id)
		
	});
		
}


/**
* This function display the stop_name and the bus lines that stop there
* Parameter: 
* array: [] array to display contain route_id
* stop_id: stop_id link to the array of route_id
*/

function display(route_id, stop_id){
	
	// Get the stop name
	var stop_name = db.busStations.find({"stop_id" : stop_id}, {stop_name:1});
	
	for(i=0; i < array.length; i++){
		
		// Get the lines name
		var route = db.busRoutes.find({"route_id" : array[i]});
		
		// Display data
		console.log("L'arret : " + stop_name.stop_name + " desert la ligne: " + route.route_short_name);
		
	}
}


/**
* This function check if the following parameter are in busStation collection.
* @Parameter:
* stop_id: Bus stop that we want to update
* routeData: [] data concerning the bus stop
*/

function checkData(routeData, stop_id){
	
	// We parse the data
	var line_id = routeData[0].route_id;
	var line_short_name = routeData[0].route_short_name;
	var line_long_name = routeData[0].route_long_name;
	
	// Then we get the previous data corresponding 
	db.busStatons.find({"stop_id" : stop_id}).toArray(function(err, data){
		
		// Case the query return nothing
		if(err || !data){
			console.log("An error occured getting the stop information");
		}
		
		// Check if the data are already in the database or not
		try{
			previous_line_id = data[0].line_id();
		} catch(e){
			
			// If this failed, it means that no data are present yet, so we save data
			saveData(stop_id, line_id, line_short_name, line_long_name);
			
			// And we leave the function
			return;
		}
		
		// Else we parse the data to check if it's already in the collection
		for(i=0; i < previous_line_id; i++ ){
			
			// If during the parse, the route_id we want to save is in the collection, we leave it
			if(previous_line_id[i] == line_id){
				return;
			}
		}
		
		// Case data are already in the database but not this one, we save it
		saveData(stop_id, line_id, line_short_name, line_long_name);
	});
}

/**
* This function save the data to the busStations collection
* @Parameter
* stop_id : Stop bus that we want to update
* line_id: Id of the bus line we want to add
* line_short_name: Number of the line we want to add
* line_long_name: Name of the bus line we want to add
*/
function saveData(stop_id, line_id, line_short_name, line_long_name){
	
	// We update the data of the object in the busStations collection
	db.busStations.update({"stop_id": stop_id}, {$push : { "line_id": line_id, "line_short_name": line_short_name, 
	"line_long_name" : line_long_name}}, function(err, data){
		
		// CallBack function
		// Check if there has been an error or not
		if(!data || err){
			console.log('An error occured updating the bus stop: ' + stop_id);
		}
		
		// Else if data are saved
		console.log('Stop: ' + stop_id + " Updated");
	});
}