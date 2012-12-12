/******************
* filename: CreateDatabaseTables.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
/// This Script create all the database table useful for the project //////
///////////////////////////////////////////////////////////////////////////

// Variables needed for the database connection
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=true');

// Create the Bike_Stop Table
connection.query('CREATE TABLE BikeStops (BikeStop_id int, BikeStop_name VARCHAR(100),' +
                 'BikeStop_lat VARCHAR(100),BikeStop_lon VARCHAR(100), PRIMARY KEY(BikeStop_id))',
function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table Bike_Stops Created");
    }
});

// Create the Metro_Stop Table
connection.query('CREATE TABLE MetroStops (MetroStop_id int, MetroStop_name VARCHAR(100),' +
                 'MetroStop_lat VARCHAR(100),MetroStop_lon VARCHAR(100), PRIMARY KEY(MetroStop_id))',
function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table Metro_Stops Created");
    }
});

// Create the BusStops Table
connection.query('CREATE TABLE BusStops (Stop_id VARCHAR(100),'+
		 								 'Stop_name VARCHAR(100),' +
                 						 'Stop_lat VARCHAR(100),' +
										 'Stop_lon VARCHAR(100),' +
										 'Stop_code VARCHAR(100),' +
		          						 'Stop_desc VARCHAR(100),' +
										 'Zone_id VARCHAR(100),' +
										 'Stop_url VARCHAR(100),' +
										 'Location_type VARCHAR(100),' +
										 'Parent_station VARCHAR(100),' +
										 'Stop_timezone VARCHAR(100),' +
										 'Wheelchair_boarding,' +
										 'Line_short_name VARCHAR(150),' +
										 'Line_long_name VARCAHR(150),' +
										 'PRIMARY KEY(Stop_id))',
function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table BusStops Created");
    }
});

// Create the BusStop_Times Table
connection.query('CREATE TABLE BusStop_times (Stop_id VARCHAR(100),'+
		 								 'Stop_sequence VARCHAR(100),' +
                 						 'Trip_id VARCHAR(100),' +
										 'Arrival_time VARCHAR(100),' +
										 'Departure_time VARCHAR(100),' +
		          						 'Stop_headsign VARCHAR(100),' +
										 'Pickup_type VARCHAR(100),' +
										 'Drop_off_type VARCHAR(100),' +
										 'Shape_dist_traveled VARCHAR(100))',
	function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table BusStop_Times Created");
    }
});

// Create the BusTrips Table
connection.query('CREATE TABLE BusTrips (Trip_id VARCHAR(100),'+
		 								 'Service_id VARCHAR(100),' +
                 						 'Route_id VARCHAR(100),' +
										 'Trip_headsign VARCHAR(100),' +
										 'Direction_id VARCHAR(100),' +
		          						 'Block_id VARCHAR(100),' +
										 'PRIMARY KEY(Trip_id))',
function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table BusTrips Created");
    }
});

// Create the BusRoutes Table
connection.query('CREATE TABLE BusRoutes (Route_id VARCHAR(100),'+
		 								 'Route_short_name VARCHAR(100),' +
                 						 'Route_long_name VARCHAR(100),' +
										 'Agency_id VARCHAR(100),' +
										 'Route_desc VARCHAR(100),' +
		          						 'Route_type VARCHAR(100),' +
										 'Route_url VARCHAR(100),' +
										 'Route_color VARCHAR(100),' +
										 'Route_text_color VARCHAR(100),' +
										 'PRIMARY KEY(Route_id))',
function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table BusRoutes Created");
    }
});


// Create the TerStops Table

connection.query('CREATE TABLE TERStops (Stop_id VARCHAR(100),'+
		 								 'Stop_name VARCHAR(100),' +
                 						 'Stop_lat VARCHAR(100),' +
										 'Stop_lon VARCHAR(100),' +
										 'Stop_code VARCHAR(100),' +
		          						 'Stop_desc VARCHAR(100),' +
										 'Zone_id VARCHAR(100),' +
										 'Stop_url VARCHAR(100),' +
										 'Location_type VARCHAR(100),' +
										 'Parent_station VARCHAR(100),' +
										 'Stop_timezone VARCHAR(100),' +
										 'Wheelchair_boarding,' +
										 'PRIMARY KEY(Stop_id))',
function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table TERStops Created");
    }
});



// Create the TerStop_Times Table
connection.query('CREATE TABLE TerStop_times (Stop_id VARCHAR(100),'+
		 								 'Stop_sequence VARCHAR(100),' +
                 						 'Trip_id VARCHAR(100),' +
										 'Arrival_time VARCHAR(100),' +
										 'Departure_time VARCHAR(100),' +
		          						 'Stop_headsign VARCHAR(100),' +
										 'Pickup_type VARCHAR(100),' +
										 'Drop_off_type VARCHAR(100),' +
										 'Shape_dist_traveled VARCHAR(100))',
	function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table TerStop_Times Created");
    }
});

// Create the TerTrips Table
connection.query('CREATE TABLE TerTrips (Trip_id VARCHAR(100),'+
		 								 'Service_id VARCHAR(100),' +
                 						 'Route_id VARCHAR(100),' +
										 'Trip_headsign VARCHAR(100),' +
										 'Direction_id VARCHAR(100),' +
		          						 'Block_id VARCHAR(100),' +
										 'PRIMARY KEY(Trip_id))',
function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table TerTrips Created");
    }
});

// Create the TerRoutes Table
connection.query('CREATE TABLE TerRoutes (Route_id VARCHAR(100),'+
		 								 'Route_short_name VARCHAR(100),' +
                 						 'Route_long_name VARCHAR(100),' +
										 'Agency_id VARCHAR(100),' +
										 'Route_desc VARCHAR(100),' +
		          						 'Route_type VARCHAR(100),' +
										 'Route_url VARCHAR(100),' +
										 'Route_color VARCHAR(100),' +
										 'Route_text_color VARCHAR(100),' +
										 'PRIMARY KEY(Route_id))',
function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table TerRoutes Created");
    }
});

