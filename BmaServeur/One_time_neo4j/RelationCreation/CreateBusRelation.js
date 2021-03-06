/******************
* filename: CreateBusRelation.js
* date: 08/01/13
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file create the relations between each bus Stop

// Connection mySql DataBase  
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Connection Neo4j database
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

// Variable needed to use jquery
var $ = require('jquery');

/**
* Get all the trip_id from the sql table
*/
connection.query('SELECT Trip_id FROM test.BusTrips', function(err, result){

  // Case there is an error during the request
  if(err || !result){
    console.log('An error occured getting the sql trip_id :: ' + err);
  } else {
    console.log('Trips_id stored');
    getDataForATripId(result); // Call the function which will parse the data
  }
});

/**
* Parse the trip ID 
*/
function getDataForATripId(trips){

  // Parse the all tripsId
  for(i=0; i<trips.length/3; i++){

    /* For each trip id, we query the database to get all the stop_id, arrival and departure time and stop sequence
     The SQL query is the following one:

     SELECT BusTrips.Trip_id, BusStop_times.*, BusTrips.Trip_headsign, BusStops.Stop_id
     FROM BusStops as busstops, BusTrips as bustrips, BusStop_times as busstop_times
     WHERE bustrips.Trip_id = '"1"'
     AND bustrips.Trip_id = busstop_times.Trip_id
     AND busstop_times.Stop_id = busstops.Stop_id
     ORDER BY busStop_times.Stop_sequence ASC;
     */

     connection.query("SELECT test.BusTrips.Trip_id, test.BusStop_times.*, test.BusTrips.Trip_headsign, test.BusStops.Stop_id, test.BusStops.NodeId " +
       "FROM test.BusStops, test.BusTrips, test.BusStop_times " +
       "WHERE BusTrips.Trip_id = \'" + trips[i].Trip_id + "\' " +
       "AND BusTrips.Trip_id = BusStop_times.Trip_id " +
       "AND BusStop_times.Stop_id = BusStops.Stop_id " +
       "ORDER BY BusStop_times.Stop_sequence ASC", function(err, result){

                      // Case of error getting the data concerning the trip_id
                      if(err || !result){
                        console.log('An error occured getting the data from the trip_id :: ' + trips[i].Trip_id + ' :: ' + err);
                        throw err;
                      } else {
                        //console.log(result);
                        parseDataOfTrip(result); // Call the function which parse the data
                      }

                    });
   }

 }

/**
* This function will parse the data in order to create relations between busStops
*/
function parseDataOfTrip(data){

  // Variable of the function
  
  var temp = null
  var time = null;
  var departTime = null;
  var arrivalTime = null

  // Parse the data
  for(var j=0; j< data.length; j++){

    var time = null ;  // Initialize the variable
    temp = null;       // Initiate the variable

    // Check if there is a next stop
    if(j+1 <data.length -1){


     // First extract the departure Time of the first stops
     temp = data[j].Departure_time.split(':');

     // Convert the departure time into Seconds
     departTime = temp[0]*3600 + temp[1] * 60 + temp[2];

     // Get the arrival time of the next Stops
     temp = data[j+1].Arrival_time.split(':');

     // Convert the arrival time into seconds
     arrivalTime = temp[0]*3600 + temp[1] * 60 + temp[2];

     // Get the difference between the two times
     time = arrivalTime - departTime;
     time = time / 6000; // Convert seconds into minute

     /*** Debug ****/
     console.log('Node départ :: ' + data[j].NodeId);
     console.log('Node arrivé :: ' + data[j+1].NodeId);
     console.log('Depart Time :: ' + data[j].Departure_time);
     console.log('Arrival Time :: ' + data[j+1].Arrival_time);
     console.log('Time Between :: ' + time);
     console.log('Trip Headsign :: ' + data[j].Trip_headsign);

     var trip = removeCrap(data[j].Trip_headsign);

     // Create the relation
     db.insertRelationship(data[j].NodeId, data[j+1].NodeId, 'Bus', {
      time: time,
      trip_id: data[j].Trip_id,
      //trip_headsign: trip
     }, function(err, result){

      // Case of error
      if(err || !result){
        console.log('An error occured creatingthe relation :: ' + err);
      } else {
        console.log('Relation created :: ' + result.id);


      }

     });
  }

}
}


/**
*/
function removeCrap(str){
  try{
    console.log(str);
    var newstr = str.replace('é','e');
    console.log(newstr);
  } catch(e){
    throw e;
    return str;
  }
  return newstr;
}

