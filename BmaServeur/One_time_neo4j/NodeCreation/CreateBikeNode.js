/******************
* filename: CreateBikeNode.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file create the Bike node for the graph needed to built the route directions

// Connection mySql DataBase  
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Connection Neo4j database
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

// Variable needed to use jquery
var $ = require('jquery');


/**
* Here we query the SQL database to get each bike stops and create a node for each bike Stops
* Then we add the nodeiD into the Mysql database
*/

var query = connection.query('SELECT * FROM test.BikeStops');
query
.on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
})
.on('fields', function(fields) {
    // the field packets for the rows to follow
})
.on('result', function(row) {
   // Create the node
   db.insertNode({Name: row.BikeStop_name, idStop: row.BikeStop_id, Lat: row.BikeStop_lat, Lng: row.BikeStop_lon, type: "Bike"},
   	function(err, node){

   		// Case of error during the call
   		if(err || !node){
   			console.log('An error occured creating the bike node :: ' + err);
   		}
		else {
			console.log('Bike Node created :: ' + node.id);

			// Once the node is created, we add the node id into the BikeStops Table
			updateDb(row.BikeStop_id, node.id);
		}   		
   	});

})

.on('end', function() {

});


/**
* This function Update the Bike Stops table by adding the nodeId into the line
*/
function updateDb(stop_id, node_id){

	connection.query('UPDATE test.BikeStops SET NodeId = ' + node_id + ' WHERE test.BikeStops.BikeStop_id = ' + stop_id, 
		function(err, result){

			// Case of error when updating the table
			if(err || !result){
				console.log('An error occured updating the BikeStops table :: ' + err);
			} else
				console.log('BikeStop :: ' + stop_id + ' Updated');

		});
}
