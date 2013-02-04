// This file create the node for the graph needed to built the route directions

// Connection mySql DataBase  
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Connection Neo4j database
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

// Variable needed to use jquery
var $ = require('jquery');


 var previous_row;
/**
* Here we query the SQL database to get each bike stops and create a node for each bike Stops
* Then we add the nodeiD into the Mysql database
*/

var query = connection.query('SELECT BusStops.Stop_id, BusStop_times.Stop_id, BusStop_times.Arrival_time, BusStop_times.Trip_id, BusTrips.Trip_id ' +
							 'FROM BusStops, BusStop_times, BusTrips ' +
							 'WHERE BusTrips.Trip_id = BusStop_times.Trip_id ' +
							 'AND BusStop_times.Stop_id = BusStops.Stop_id ' +
							 'ORDER BY BusStops.Stop_id ASC');
query
.on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
})
.on('fields', function(fields) {
    // the field packets for the rows to follow
})
.on('result', function(row) {

	console.log(row);
	

  // Create the node
  /*db.insertNode({Name: row.Stop_name, idStop: row.Stop_id, Lat: row.Stop_lat, Lng: row.Stop_lon, type:"Bus"},

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
        });*/
})
.on('end', function() {
});