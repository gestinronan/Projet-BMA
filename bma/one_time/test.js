// Connection to the database
var databaseUrl = "stops"; // "username:password@example.com/mydb"
var collections = ["busStations", "busStopTimes", "busRoutes", "busTrips", "reports"]
var db = require("mongojs").connect(databaseUrl, collections);

// Jquery variable
var $ = require('jQuery');

var _stop_id = '"2515"';

// Find the trip_id thanks to the stop_id
db.busStopTimes.find({"stop_id" : _stop_id}).toArray(function(err, data){
	
	// Case of error
	//if(!data || err){
	//	console.log("An error occured");
	//	process.exit(0);
	//}
	
	// Else we diplay the result

	console.log(data[0].trip_id);
	console.log(data.length);
	//process.exit(0);
	
	// Call the next function
	getRoute(data[0].trip_id);
	
});

function getRoute(trip_id){
	
	console.log(trip_id);
	
	db.collection('busTrips').find({"trip_id": trip_id }).toArray(function(err, data){
		
		console.log(data);
		//console.log("route_id: " + data[0].route_id);
		
		getName(data[0].route_id);
		
	});
}

function getName(route_id){
	
	console.log(route_id);
	
	db.collection('busRoutes').find({"route_id" : route_id}).toArray(function(err, data){
		
		console.log(data);
		//console.log('name: ' + data[0].route_name);
		
		process.exit(0);
	});
}