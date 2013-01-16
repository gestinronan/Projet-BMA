/******************
* filename: CreateGraphNode.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file create the node for the graph needed to built the route directions

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

var query = connection.query('SELECT * FROM BikeStops');
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

			 	// Callback (function which callend when the insertNode function is done)
			 	function(err, node){

			 		// Case of error
			 		if(err){
			 			console.log("An error occured");
			 		} else
			 		console.log("BikeNode created : " + node.id);

			 		// Then we update the Mysql bike stop table by adding the node ID for each bike stop
			 		connection.query('UPDATE test.BikeStops' + 
			 			' SET NodeId = ' + node.id + 
			 			' WHERE BikeStop_id = ' + row.BikeStop_id,
                    // callback
                    function(err, result){

                      // Case of error
                      if(err){
                      	console.log('Bike stop not updated ' + err);
                      } else {
                      	console.log('Bike stop updated');
                      }
                  }
                  );


			 	});
})
.on('end', function() {

});

/**
* Here we query the SQL database to get each bus stops and create a node for each bus Stops
* Then we add the nodeiD into the Mysql database
*/

var query = connection.query('SELECT * FROM test.BusStops');
query
.on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
})
.on('fields', function(fields) {
    // the field packets for the rows to follow
})
.on('result', function(row) {

  // Create the node
  db.insertNode({Name: row.Stop_name, idStop: row.Stop_id, Lat: row.Stop_lat, Lng: row.Stop_lon, type:"Bus"},

        // Callback (function which callend when the insertNode function is done)
        function(err, node){

          // Case of error
          if(err){
            console.log("An error occured");
          } else
          console.log("BusNode created : " + node.id);
          // Then we update the mysql database by adding the nodeId for each busStops
          connection.query('UPDATE test.BusStops' +
                           ' SET NodeId = ' + node.id +
                           ' WHERE Stop_id = \'' + row.Stop_id + '\'', 
                            // Callback
                            function(err, result){

                                // Case of error
                                if(err){
                                  console.log("Bus Stop not updated " + err);
                                } else {
                                  console.log("Bus Stop updated " + result);
                                }

                              });
        });
})
.on('end', function() {
});

/**
* Here we query the SQL database to get each metro stops and create a node for each metro Stops
* Then we add the nodeiD into the Mysql database
*/

var query = connection.query('SELECT * FROM MetroStops');
query
.on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
})
.on('fields', function(fields) {
    // the field packets for the rows to follow
})
.on('result', function(row) {
	db.insertNode({Name: row.MetroStop_name, idStop: row.MetroStop_id, Lat: row.MetroStop_lat, Lng: row.MetroStop_lon, type:"Metro"},

			 	// Callback (function which callend when the insertNode function is done)
			 	function(err, node){

			 		// Case of error
			 		if(err){
			 			console.log("An error occured");
			 		} else
			 		console.log("MetroNode created : " + node.id);
			 		// Then we update the Mysql bike stop table by adding the node ID for each bike stop
			 		connection.query('UPDATE test.MetroStops' + 
                     ' SET NodeId = ' + node.id + 
                     ' WHERE MetroStop_id = "' + row.MetroStop_id + '"',

                    // Callback
                    function(err, result){

                      // Case of error
                      if(err){
                        console.log('Metro stop not updated ' + err);
                      } else {
                        console.log('Metro stop updated');
                      }
                    }
    );
			 	});
})
.on('end', function() {

});

