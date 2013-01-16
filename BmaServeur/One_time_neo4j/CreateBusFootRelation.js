/******************
* filename: CreateBusFootRelation.js
* date: 08/01/13
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file create the relations between each bike Stop

// Connection mySql DataBase  
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Connection Neo4j database
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

// Variable needed to use jquery
var $ = require('jquery');

// Variable needed to use the cloudmade api (http://developers.cloudmade.com/projects/routing-http-api/examples)
var url = 'http://routes.cloudmade.com';
var api_key = '381cd1d2cba94c069b8396f0dcf1ab94';

// Local variable
var busData = new Array();

/**
* Due to the big amount of data, we first get the bus data
* And then we stream the bus stops data, Calcul the time and distance between the streamed data and the data from 
* the array finally we create the relation
*/
connection.query('SELECT * FROM test.BusStops', function(err, result){

	// Case of error
	if(err){
		console.log('An error occured');
		throw err;
	}
	// Case of success
	else {

    // Once the query is done, we stream the bus data and calcul the relationship
    console.log('First query done!');
    streamBusTableData();
  }
});


/**
* This function stream the busStops table data
* For each row of the table, we call the getApproximativeFootDistance function
*/
function streamBusTableData(){

  var i = 0;
  // Query the database
  var query = connection.query('SELECT * FROM BusStops');
  query 
  .on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
  })
  .on('fields', function(fields) {
    // the field packets for the rows to follow
  })
  .on('result', function(row) {

    // The current row will be compare to all the others except itself

    // We first parse the busData array
    for(j=0; j<busData.length; j++){

      // Debug stuff
      console.log("Row stream: " + i + " compared to result: " + j)

      // if the busStop from the array is different from the current streamed row
      // we call the getApproximativeFootDistance
      if(row != busData[j]){
        getApproximativeFootDistance(row, busData[j]);
      }
    }
    i++;
  })
  .on('end', function() {

  });
}



/**
* Because we are creating the realtion by foot between each bus stop, 
* we are going to check how far are the two bus stops.
* If the distance is more than 600m, we won't save the relation
*/

function getApproximativeFootDistance(pointA, pointB){

  // Rayon de la terre
  var rayonTerre = 6366;

  // We get latitude and longitude from the two points
  var latA = pointA.Stop_lat;
  var lngA = pointA.Stop_lon;
  var latB = pointB.Stop_lat;
  var lngB = pointB.Stop_lon;

  // We convert the degree value into radian value
  latA = (Math.PI * latA)/180;
  lngA = (Math.PI * lngA)/180;
  latB = (Math.PI * latB)/180;
  lngB = (Math.PI * lngB)/180;

  // Precise distance
  var dist = 2 * Math.asin(Math.sqrt(Math.pow (Math.sin((latA-latB)/2), 2) + Math.cos(latA) * Math.cos(latB) * Math.pow( Math.sin((lngA-lngB)/2), 2)));

  // Convert the distance in Kilometer
  var distKm = dist * rayonTerre;

  // If the distance is lower than .6 km, we create a relation between the two bus stop
  if(distKm < 0.6){
    getFootDistance(pointA, pointB);
  }
}

/**
* This function get the distance and the time needed to go from a point A to a point B by foot
* using the cloudmade api (http://developers.cloudmade.com/projects/routing-http-api/examples)
*/

function getFootDistance(pointA, pointB){

  // This contruct the url which will return the distance and the time to go from A to B
  // The url is construct this way:
  // url + '/' + api_key + '/api/0.3/' + latA + ',' + lngA + ',' + latB + ',' + lngB + '/foot.js'
  // To make the request, we just do an ajax call thanks to jquery

  // Construct the url
  var urlFinal = url + '/' + api_key + '/api/0.3/' + pointA.Stop_lat + ',' + pointA.Stop_lon + ',' + pointB.Stop_lat + ',' + pointB.Stop_lon + '/foot.js';

  // Make th http request
  $.ajax({
    url : urlFinal,
    dataType : 'json',
    
    // Case of success call
    success: function(data){

      // Once we have the distance and the time between A and B
      var dist = data.route_summary.total_distance // Distance in meters
      var time = data.route_summary.total_time; // Estimated times in seconds

      console.log(data.route_summary.total_distance);
      console.log(data.route_summary.total_time);

      // Then we create the graph relationship between the two points
      createRelation(dist, time, pointA, pointB, "Foot");
    },

    // Case of fail during the call
    error: function(err){
      console.log('An error occured');
    }
  });
}


/**
* This function add the relation into the graph 
*/

function createRelation(dist, time, pointA, pointB, type){

  console.log('Create the relation');
  db.insertRelationship(pointA.NodeId, pointB.NodeId, type, {
    distance: dist,
    time: time
  }, function(err, relationship){
    if(err) throw err;

        // Output relationship properties.
        console.log(relationship.data);

        // Output relationship id.
        console.log(relationship.id);

        // Output relationship start_node_id.
        console.log(relationship.start_node_id);

        // Output relationship end_node_id.
        console.log(relationship.end_node_id);
      });
}
