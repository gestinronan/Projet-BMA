/******************
* filename: RemoveDataFromSqlDb.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
/// This Script remove all the data in each table of the database /////////
///////////////////////////////////////////////////////////////////////////

/**
*
*
*			WARNING this will remove all database data!!!!!!!!!
*
*/

// Variables needed for the database connection
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=true');

// Before executing this script we ask the user to confirm
/*console.log('This script will remove All the data from the database!');
ask('Are you Sure you want to execute this script? (yes/no)', /.+/, function(response){
	if(response == "yes"){
		return;
	}
	else{
		process.exit(0);
	}
});*/

// Truncate the Bike_Stops Table
connection.query('Truncate Bike_Stops', function(err, result){
	
	// Case there is a problem during the process
	if(err){
		console.log("An error Occured during droping Bike_Stops Table");
	}
	
	// Case everyhting is ok
	else {
		console.log("Data from Bike_Stops Table droped");
	}
});

// Truncate the Metro_Stops Table
connection.query('Truncate Metro_Stops', function(err, result){
	
	// Case there is a problem during the process
	if(err){
		console.log("An error Occured during droping Metro_Stops Table");
	}
	
	// Case everyhting is ok
	else {
		console.log("Data from Metro_Stops Table droped");
	}
});

// Truncate the BusStops Table
connection.query('Truncate BusStops', function(err, result){
	
	// Case there is a problem during the process
	if(err){
		console.log("An error Occured during droping BusStops Table");
	}
	
	// Case everyhting is ok
	else {
		console.log("Data from BusStops Table droped");
	}
});

// Truncate the BusStop_Times Table
connection.query('Truncate BusStop_Times', function(err, result){
	
	// Case there is a problem during the process
	if(err){
		console.log("An error Occured during droping BusStop_Times Table");
	}
	
	// Case everyhting is ok
	else {
		console.log("Data from BusStop_Times Table droped");
	}
});

// Truncate the BusTrips Table
connection.query('Truncate BusTrips', function(err, result){
	
	// Case there is a problem during the process
	if(err){
		console.log("An error Occured during droping BusTrips Table");
	}
	
	// Case everyhting is ok
	else {
		console.log("Data from BusTrips Table droped");
	}
});

// Truncate the BusRoutes Table
onnection.query('Truncate BusRoutes', function(err, result){
	
	// Case there is a problem during the process
	if(err){
		console.log("An error Occured during droping BusRoutes Table");
	}
	
	// Case everyhting is ok
	else {
		console.log("Data from BusRoutess Table droped");
	}
});

// Truncate the TerStops Table
connection.query('TRUNCATE TerStops', function(err, result){
	
	// Case there is a problem during the truncate
	if(err){
		console.log("An error Occured during truncating the TerStops Table");
	} 
	
	// Case there had been no problem
	else{
		console.log("Data from TerStops Table has been removed");
	}
});

// Truncate the TerStop_Times Table
connection.query('TRUNCATE TerStop_Times', function(err, result){
	
	// Case there is a problem during the truncate
	if(err){
		console.log("An error Occured during truncating the TerStop_Times Table");
	} 
	
	// Case there had been no problem
	else{
		console.log("Data from TerStop_Times Table has been removed");
	}
});

// Truncate the TerTrips Table
connection.query('TRUNCATE TerTrips', function(err, result){
	
	// Case there is a problem during the truncate
	if(err){
		console.log("An error Occured during truncating the TerTrips Table");
	} 
	
	// Case there had been no problem
	else{
		console.log("Data from TerTrips Table has been removed");
	}
});

// Truncate the TerRoutes Table
connection.query('TRUNCATE TerRoutes', function(err, result){
	
	// Case there is a problem during the truncate
	if(err){
		console.log("An error Occured during truncating the TerRoutes Table");
	} 
	
	// Case there had been no problem
	else{
		console.log("Data from TerRoutes Table has been removed");
	}
});