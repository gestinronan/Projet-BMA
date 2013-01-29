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
  
/**
* Here we query the SQL database to get each bus stops and create a node for each bus Stops
* Then we add the nodeiD into the Mysql database
*/
getBusId();



var busStopId;

/** Get all the Stop_id for the bus ***/
function getBusId(){
  connection.query('SELECT Stop_id FROM test.BusStops', function(err, result){
    // Case of error
    if(err){
      console.log('an error occured :: ' + err)
      process.exit(1);
    }
    else{

      // Save the data into a variable
      busStopId = result;
      // Then call the function to get the resulting node
      createBusNode(busStopId);
    }

  });
}

/** This function query the sql db for each busStops. It get all the trip_id and arrival_time **/
function createBusNode(busStopId){

  // Loop which parse all the busStop
  for(i=0; i <busStopId.length; i++){

    // Remove quotes from the stop_Id
    busStopId[i].Stop_id = replaceAll(busStopId[i].Stop_id, "'", "");
    console.log(busStopId[i]);
    // For each stop, we make a query
    connection.query('SELECT BusStops.Stop_id, BusStops.Stop_name, BusStops.Stop_lat, BusStops.Stop_lon, BusStop_times.Stop_id, BusStop_times.Arrival_time, BusStop_times.Trip_id, BusTrips.Trip_id ' +
                     'FROM test.BusStops, test.BusStop_times, test.BusTrips '+ 
                     "WHERE BusStops.Stop_id = \'" + busStopId[i].Stop_id + "\'" +
                     ' AND BusTrips.Trip_id = BusStop_times.Trip_id '+
                     'AND BusStop_times.Stop_id = BusStops.Stop_id ', function(err, result){

                      // Case there is an error during the call
                      if(err || !result){
                        console.log(err);
                      }

                      console.log(result);

                      // For eac bus Stop, we have all the trip_id and the arrival_time

                      var busStopData = new Array;
                      
                      // Create the properties of the busStop node which will be added to the graph
                      busStopData[0] = 'Name:' + result[0].Stop_name;
                      busStopData[1] = 'idStop:' + result[0].Stop_id;
                      busStopData[2] = 'Lat:' + result[0].Stop_lat;
                      busStopData[3] = 'Lon:' + result[0].Stop_lon;

                      var k = 4; // Index of data

                      // Then we add the trip_id:arrival_time
                      for (j=0; j<result.length; j++){
                        busStopData[k] = result[j].Trip_id + ':' + result[j].Arrival_time;
                        k++;
                      } 

                      // Once all the properties are stored in an array, we create a JSON Object
                      var finalData;

                      // Add the data to the object
                      for(n=0; n<busStopData.length; n++){
                        if(n == 0){
                          finalData = '{' + busStopData[n] + ',';

                        } else if(n == busStopData.length -1){
                          finalData = finalData + busStopData[n] + '}';
                        } else
                          finalData = finalData + busStopData[n] + ','; 


                      }

                      finalData = replaceAll(finalData, '\"', '');
                      console.log(finalData);

                      // Finally we create the node
                      db.insertNode({
                        data: finalData,
                        type: 'Bus'
                      }, function(err, node){
                        // Case of error
                        if(err){
                          console.log("An error occured");
                       } else {
                          console.log("BusNode created : " + node.id);
                          
                          // Then we update the Mysql bike stop table by adding the node ID for each bike stop
                           connection.query('UPDATE test.BusStops' + 
                                            ' SET NodeId = ' + node.id + 
                                            " WHERE Stop_id = \'" + result[0].Stop_id + "\'",

                                            // Callback
                                            function(err, result){

                                              // Case of error
                                              if(err){
                                                 console.log('Bus stop not updated ' + err);
                                              } else {
                                                console.log('Bus stop updated');
                                              }
                                            }
                            );
                       }    
                      });

                     })
  }
}

function replaceAll(txt, replace, with_this) {
  return txt.replace(new RegExp(replace, 'g'),with_this);
}
