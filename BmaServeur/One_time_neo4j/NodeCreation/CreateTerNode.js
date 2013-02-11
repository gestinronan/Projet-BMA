/******************
* filename: CreateBikeNode.js
* data: 11/02/13
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file create the Ter node for the graph needed to built the route directions

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

var query = connection.query('SELECT * FROM test.TerStops');
query
.on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
})
.on('fields', function(fields) {
    // the field packets for the rows to follow
})
.on('result', function(row) {
   // Create the node
   db.insertNode({Name: row.Stop_name, idStop: row.Stop_id, Lat: row.Stop_lat, Lng: row.Stop_lon, type: "Train"},
   	function(err, node){

   		// Case of error during the call
   		if(err || !node){
   			console.log('An error occured creating the bike node :: ' + err);
   		}
		else {
			console.log('Ter Node created :: ' + node.id);

			// Once the node is created, we add the node id into the BikeStops Table
			updateDb(row.Stop_id, node.id);
		}   		
   	});

})

.on('end', function() {

});


/**
* This function Update the Bike Stops table by adding the nodeId into the line
*/
function updateDb(stop_id, node_id){

	console.log("Train stop_id :: " + stop_id);

	connection.query("UPDATE test.TerStops SET NodeId = " + node_id + " WHERE test.TerStops.Stop_id = \'" + stop_id + "\'", 
		function(err, result){

			// Case of error when updating the table
			if(err || !result){
				console.log('An error occured updating the BikeStops table :: ' + err);
			} else
				console.log('TerStop :: ' + stop_id + ' Updated');

		});
}
