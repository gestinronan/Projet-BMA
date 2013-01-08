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

connection.query('SELECT * FROM test.BusStops', function(err, function){

	// Case of error
	if(err){
		console.log('An error occured');
		throw err;
	}
	// Case of success
	else {
		// We parse the result
	for(i=0; i<result.length; i++){
		for(j=0; j<result.length; j++){

			// Case the bike stop is not the same as the one from the first loop
			if(result[j] != result[i]){
				
				// We call the api, and create the relation into the graph
				getFootDistance(result[i], result[j]);	
			}
		}
	}
	}
});


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
