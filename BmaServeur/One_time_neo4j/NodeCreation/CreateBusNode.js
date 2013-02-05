/******************
* filename: CreateBusNode.js
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

// Variables
var busStopId = new Array();  // Array which will contain all the BusStop_id

/**
* First We get all the BusStops Id
*/
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
      console.log('First Query done!');
      createBusNode(busStopId);
  }

});


/**
* This function get all the properties which will be added to the bus node and create the bus node
*/
function createBusNode(allStopsId){

	// For each bus Stops, we get the data from the sql table
	for(i=0; i<allStopsId.length; i++){
		

		connection.query('SELECT BusStops.Stop_id, BusStops.Stop_name, BusStops.Stop_lat, BusStops.Stop_lon, BusStop_times.Stop_id, BusStop_times.Arrival_time, BusStop_times.Trip_id, BusTrips.Trip_id ' +
			'FROM test.BusStops, test.BusStop_times, test.BusTrips '+ 
			"WHERE BusStops.Stop_id = \'" + allStopsId[i].Stop_id + "\'" +
			' AND BusTrips.Trip_id = BusStop_times.Trip_id '+
			'AND BusStop_times.Stop_id = BusStops.Stop_id ', function(err, result){

                      // Case there is an error during the call
                      if(err || !result){
                      	console.log(err);
                      }
                      if(result){
                      // Store the data into an array
                      var busStopProperties = new Array();
                      
                      // Then we add the trip_id:arrival_time
                      for (j=0; j<result.length; j++){
                      	busStopProperties[j] = result[j].Trip_id + ':' + result[j].Arrival_time;

                      }

                      // Built a JSON from the array
                      var finalData;

                      // Add the data to the object
                      for(n=0; n<busStopProperties.length; n++){
                      	if(n == 0){
                      		finalData = '{' + busStopProperties[n] + ',';

                      	} else if(n == busStopProperties.length -1){
                      		finalData = finalData + busStopProperties[n] + '}';
                      	} else
                      	finalData = finalData + busStopProperties[n] + ','; 


                      }

                      // Then create the graph node
                      // Check if there is data before creating the node
                      if(result[0] != undefined && finalData != undefined){
                      try{
                      finalData = replaceAll(finalData, '\"', '');
                      db.insertNode({Name: result[0].Stop_name, idStop: result[0].Stop_id, Lat: result[0].Stop_lat, Lng: result[0].Stop_lon, type: "Bus", data: finalData},
                       function(err, node){

                      	// Case of error when creating the node
                      	if(err || !node){
                      		console.log('An error occured creating the Bus node :: ' + err);
                      	} else {
                      		console.log('Bus Node created :: ' + node.id);

                      		// Then we update the busStops Table by adding the node Id
                      		updateDb(result[0].Stop_id, node.id);
                      	}

                      });
                  } catch(e){
                  	throw e;
                  }
                  }
                  }


              });
}
}



/**
* This function Update the Bike Stops table by adding the nodeId into the line
*/
function updateDb(stop_id, node_id){
	
	console.log("UPDATE test.BusStops SET NodeId = " + node_id + " WHERE test.BusStops.Stop_id = \'" + stop_id + "\'");
	connection.query("UPDATE test.BusStops SET NodeId = " + node_id + " WHERE test.BusStops.Stop_id = \'" + stop_id + "\'", 
		function(err, result){

			// Case of error when updating the table
			if(err || !result){
				console.log('An error occured updating the busStops table :: ' + err);
			} else
			console.log('BusStop :: ' + stop_id + ' Updated');

		});
}

/**
* Thid function replace all caracter from a string to the one we want
*/
function replaceAll(txt, replace, with_this) {
	if(txt){
		return txt.replace(new RegExp(replace, 'g'),with_this);
	}	
	else return txt;
}
