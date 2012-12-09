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
        console.log("Table Ter_Stops Created");
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
        console.log("Table Ter_Stops Created");
    }
});

// Create the BusStops Table

// Create the BusStop_Times Table

// Create the BusTrips Table

// Create the BusRoutes Table

// Create the TerStops Table

connection.query('CREATE TABLE TerStops (Stop_id int, Stop_name VARCHAR(100),' +
                 'Stop_lat VARCHAR(100),Stop_lon VARCHAR(100), PRIMARY KEY(Stop_id))',
function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table Ter_Stops Created");
    }
});


// Create the TerStop_Times Table

// Create the TerTrips Table

// Create the TerRoutes Table
