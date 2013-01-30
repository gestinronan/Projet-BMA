/******************
* filename: CreateMetroNode.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file create all metro nodes for the graph

// Connection mySql DataBase  
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Connection Neo4j database
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

// Variable needed to use jquery
var $ = require('jquery');


/**
* Here we query the SQL database to get each metro stops and create a node for each metro Stops
* Then we add the nodeiD into the Mysql database
*/

var query = connection.query('SELECT * FROM test.MetroStops');
query
.on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
})
.on('fields', function(fields) {
    // the field packets for the rows to follow
})
.on('result', function(row) {
   // Create the node
   db.insertNode({Name: row.MetroStop_name, idStop: row.MetroStop_id, Lat: row.MetroStop_lat, Lng: row.MetroStop_lon, type: "Metro"},
   	function(err, node){

   		// Case of error during the call
   		if(err || !node){
   			console.log('An error occured creating the Metro node :: ' + err);
   		}
		else {
			console.log('Metro Node created :: ' + node.id);

			// Once the node is created, we add the node id into the BikeStops Table
			updateDb(row.MetroStop_id, node.id);
		}   		
   	});

})

.on('end', function() {

});


/**
* This function Update the  MetroStops table by adding the nodeId into the line
*/
function updateDb(stop_id, node_id){

	connection.query("UPDATE test.MetroStops SET NodeId = " + node_id + " WHERE test.MetroStops.MetroStop_id = \'" + stop_id + "\'", 
		function(err, result){

			// Case of error when updating the table
			if(err || !result){
				console.log('An error occured updating the MetroStops table :: ' + err);
			} else
				console.log('MetroStop :: ' + stop_id + ' Updated');

		});
}
