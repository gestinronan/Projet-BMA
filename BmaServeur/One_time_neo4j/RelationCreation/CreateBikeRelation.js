/******************
* filename: CreateBikeRelation.js
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
var url = 'http://routes.cloudmade.com/';
var api_key = '381cd1d2cba94c069b8396f0dcf1ab94';


/**
* This get all the data from the BikeStops Table
*/
connection.query("SELECT * FROM test.BikeStops", function(err, result){

	// We parse the result
	for(i=0; i<result.length; i++){
		for(j=0; j<result.length; j++){

			// Case the bike stop is not the same as the one from the first loop
			if(result[j] != result[i]){
				
				// We call the api, and create the relation into the graph
				getBikeDistance(result[i], result[j]);	
			}
		}
	}
});



function getBikeDistance(pointA, pointB){

  // This contruct the url which will return the distance and the time to go from A to B
  // The url is construct this way:
  // url + '/' + api_key + '/api/0.3/' + latA + ',' + lngA + ',' + latB + ',' + lngB + '/bicycle.js'
  // To make the request, we just do an ajax call thanks to jquery

  // Construct the url
  var urlFinal = url + api_key + '/api/0.3/' + pointA.BikeStop_lat + ',' + pointA.BikeStop_lon + ',' + pointB.BikeStop_lat + ',' + pointB.BikeStop_lon + '/bicycle.js';

  // Debug
  console.log("getBikeDistance");

  // Make th http request
  $.ajax({
    url : urlFinal,
    dataType : 'json',
    
    // Case of success call
    success: function(data){

      //console.log(data);

      // Once we have the distance and the time between A and B
      var dist = data.route_summary.total_distance / 1000; // Distance in meters
      var time = data.route_summary.total_time / 60; // Estimated times in seconds

      console.log(data.route_summary.total_distance);
      console.log(data.route_summary.total_time);

      // Then we create the graph relationship between the two points
      createRelation(dist, time, pointA, pointB, "Bike");
  },

    // Case of fail during the call
    error: function(err){
      console.log(err);
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
