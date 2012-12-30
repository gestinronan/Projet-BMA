/******************
* filename: CreateGraph.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file create the graph needed to built the route directions

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

// Variable of node
var BikeNode = new Array();
var BusNode = new Array();
var MetroNode = new Array();
var TrainNode = new Array();


getBusStop();


/**
* This function stream the BusStops table and create all the node. This also add the node into 
* the BusNode Array
*/

function getBusStop(){

  var i= 0;
  var query = connection.query('SELECT * FROM BusStops');
  query
  .on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
  })
  .on('fields', function(fields) {
    // the field packets for the rows to follow
  })
  .on('result', function(row) {

  // Create the node
  BusNode[i] = db.insertNode({Name: row.Stop_name, idStop: row.Stop_id, Lat: row.Stop_lat, Lng: row.Stop_lon, type:"Bus"},

			 	// Callback (function which callend when the insertNode function is done)
			 	function(err, node){

			 		// Case of error
			 		if(err){
			 			console.log("An error occured");
			 		} else
			 		console.log("BusNode created : " + node.id);
			 	});
  i++;
  })
  .on('end', function() {

    // When it's done we add the bike stop into our graph
    getBikeStop();
  });
}

/**
* This function stream the BikeStops table and create all the node. This also add the node into 
* the BikeNode Array
*/
function getBikeStop(){
  var j = 0;
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
   BikeNode[j] = db.insertNode({Name: row.BikeStop_name, idStop: row.BikeStop_id, Lat: row.BikeStop_lat, Lng: row.BikeStop_lon, type: "Bike"}, 

			 	// Callback (function which callend when the insertNode function is done)
			 	function(err, node){

			 		// Case of error
			 		if(err){
			 			console.log("An error occured");
			 		} else
			 		console.log("BikeNode created : " + node.id);
			 	});
   j++;
  })
  .on('end', function() {

    // When it's done, we add the metro node into our graph
    getMetroStop();
  });

}

/**
* This function stream the MetroStops table and create all the node. This also add the node into 
* the MetroNode Array
*/

function getMetroStop(){

	var k = 0;

	var query = connection.query('SELECT * FROM MetroStops');
  query
  .on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
  })
  .on('fields', function(fields) {
    // the field packets for the rows to follow
  })
  .on('result', function(row) {
    MetroNode[k] = db.insertNode({Name: row.MetroStop_name, idStop: row.MetroStop_id, Lat: row.MetroStop_lat, Lng: row.MetroStop_lon, type:"Metro"},

			 	// Callback (function which callend when the insertNode function is done)
			 	function(err, node){

			 		// Case of error
			 		if(err){
			 			console.log("An error occured");
			 		} else
			 		console.log("MetroNode created : " + node.id);
			 	});
    k++;
  })
  .on('end', function() {

    // Once it's done, we parse the node arrays and create the relationships into our graph
    createAllRelation();
});

}

/**
* This function call all others function to create every relation between each node
*/
function createAllRelation(){

  
  createBikeRelation();            // Create relations between bike stops
  createMetroRelation();           // Create relations between metro stops
  createBusRelation();             // Create relations between bus stops
  createTrainRelation();           // Create relations between train stops
  createBusFootRelation();         // Create relations between bus stops by foot
  createBikeMetroFootRelation();   // Create relations between bike stops and metro stops by foot
  createBusMetroFootRelation();    // Create relations between bus stops and metro stops by foot
  createBikeMetroFootRelation();   // Creata relations between bike stops and metro stops by foot
  createBikeBusFootRelation();     // Create relations between bike stops and bus stops by foot
  createTrainMetroFootRelation();  // Create relations between train stops and metro stops by foot
  createTrainBusFootRelation();    // Create relations between train stops and bus stops by foot
  createTrainBikeFootRelation();   // Create relations between train stops and bike stops by foot
  upDateBusStopsTable();           // Update the BusStops table by adding the NodeId columns
  upDateBikeStopsTable();          // Update the BikeStops table by adding the NodeId columns
  upDateMetroStopsTable();         // Update the MetroStops table by adding the NodeId columns

}

/**
* This function parse the BikeNode array and create all the relation between each bikeStop
*/

function createBikeRelation(){

  // In order to calculate all the distance between each bike stop, we parse the BikeNode array
  for(i=0; i<BikeNode.length; i++){

    //For each bike stop we create a relation with all other bikestop execpt itself
    for(j=0; j<BikeNode.length; j ++){

      // We check if the BikeNode[j] is different from the BikeNode[i]
      if(BikeNode[i] != BikeNode[j]){

        // In This case we create the relation
        getBikeDistance(BikeNode[i], BikeNode[j]);
      }
    }
  }
}

/**
* This create all the realtion between each busStop using the busStop_Time table
*/
function createBusRelation(){

}

/**
* This create the relation between each metroStop
*/
function createMetroRelation(){

}

/**
* This create the relation between each train stop using the metroStop_time table
*/
function createTrainRelation(){

}

/**
* This function parse the BusNode array and create all the relation between each busStop by foot
*/
function createBusFootRelation(){

  // In order to calculate all the distance between each bus stop by foot, we parse the BusNode array
  for(i=0; i<BusNode.length; i++){

    //For each bus stop we create a relation with all other busStop execpt itself
    for(j=0; j<BusNode.length; j ++){

      // We check if BusNode[j] is different from BusNode[i]
      if(BusNode[i] != BusNode[j]){

        // In This case we create the relation
        getFootDistance(BusNode[i], BusNode[j]);
      }
    }
  }
}

/**
* This function create the relations between the bike stop and the metro stop by foot
*/
function createBikeMetroFootRelation(){

  // Parse the bikeNode array 
  for(i=0; i< BikeNode.length; i++){

    // For each metroNode we create the relationship between them
    for(j=0; j<MetroNode.length; j++){

      // Get the distance between the bikeStop and the metro stop
      getFootDistance(BikeNode[i], MetroNode[j]);
    }
  }
}

/**
* This function create the relations between the bus stop and the metro stop by foot
*/
function createBusMetroFootRelation(){

  // Parse the BusNode array
  for(i=0; i<BusNode.length; i++){

    // For each metroNode, we get the distance and time from the busStop to the metrostops
    for(j=0; j<MetroNode.length; j++){

      // Get the data (distance and time)
      getFootDistance(BusNode[i], MetroNode[j]);

    }
  }
}

/**
* This function create the relations between the bus stop and the bike stop by foot
*/
function createBikeBusFootRelation(){

  // Parse the BikeNode array
  for(i=0; i < BikeNode.length; i++){

    // For each busNode, we get the distance and time from the bike stop to the bus stop
    for(j=0; i<BusNode.length; j++){

      // Get the distance and the time between BikeNode[i] and BusNode[j]
      getFootDistance(BikeNode[i], BusNode[j]);
    }
  }
}

/**
* This create the relations between the train stop and the metro stop by foot 
*/
function createTrainMetroFootRelation(){

  // Parse the TrainNode array
  for(i=0; TrainNode.length; i++){

    // Parse the MetroNode Array
    for(j=0; j<MetroNode.length; j++){

      // Get the distance and the time between the two points
      getFootDistance(TrainNode[i], MetroNode[j]);
    }
  }
}

/**
* This create the relation between the train stops and the bus stops by foot
*/
function createTrainBusFootRelation(){

  // Parse the TrainNode array
  for(i=0; i<TrainNode.length; i++){

    // Parse the BusNode array
    for(j=0; j<BusNode.length; j++){

      // Get the distance and the time between the train stop and the bus stop
      getFootDistance(TrainNode[i], BusNode[j]);
    }
  }
}

/**
* This create the relation between the train stops and the bike stop by foot
*/
function createTrainBikeFootRelation(){

  // Parse the TrainNode array
  for(i=0; i<TrainNode.length; i++){

    // Parse the bike array
    for(j=0; j<BikeNode.length; j++){

      // Get the distance and the time between the train stop anf the bike stop
      getFootDistance(TrainNode[i], BikeNode[j]);
    }
  }

}


/**
* This function get the distance and the time needed to go from a point A to a point B by bike
* using the cloudmade api (http://developers.cloudmade.com/projects/routing-http-api/examples)
*/

function getBikeDistance(pointA, pointB){

  // This contruct the url which will return the distance and the time to go from A to B
  // The url is construct this way:
  // url + '/' + api_key + '/api/0.3/' + latA + ',' + lngA + ',' + latB + ',' + lngB + '/bicycle.js'
  // To make the request, we just do an ajax call thanks to jquery

  // Construct the url
  var urlFinal = url + '/' + api_key + '/api/0.3/' + pointA.Lat + ',' + pointA.Lng + ',' + pointB.Lat + ',' + pointB.Lng + 'bicycle.js';

  // Make th http request
  $.ajax({
    url : urlFinal,
    dataType : 'json',
    
    // Case of success call
    success: function(data){

      // Once we have the distance and the time between A and B
      var dist = data.route_summary.total_distance; // Distance in meters
      var time = data.route_summary.total_time; // Estimated times in seconds

      // Then we create the graph relationship between the two points
      createRelation(dist, time, pointA, pointB, "Bike");
  },

    // Case of fail during the call
    error: function(err){

    }
});
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
  var urlFinal = url + '/' + api_key + '/api/0.3/' + pointA.Lat + ',' + pointA.Lng + ',' + pointB.Lat + ',' + pointB.Lng + 'foot.js';

  // Make th http request
  $.ajax({
    url : urlFinal,
    dataType : 'json',
    
    // Case of success call
    success: function(data){

      // Once we have the distance and the time between A and B
      var dist = data.route_summary.total_distance; // Distance in meters
      var time = data.route_summary.total_time; // Estimated times in seconds

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

  db.insertRelationship(pointA.id, pointB.id, type, {
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

/**
* This function add the columns NodeId to the BusStops Table. Each Bus Stop will have its NodeId
*/

function upDateBusStopsTable(){

  // We parse the BusNode array
  for(i=0; i<BusNode.length; i++){
    connection.query('UPDATE test.BusStops '+
                     'SET NodeId = ' + BuseNode[i].id + ' ' +
                     'WHERE Stop_id = ' + BusNode[i].idStop, 

                     // Callback
                     function(err, result){

                      // Case of error
                      if(err){
                        console.log("Bus Stop not updated " + err);
                      } else {
                        console.log("Bus Stop updated");
                      }

    });
  }
}

/** 
* This function add the columns NodeId to the BikeStops Table
*/
function upDateBikeStopsTable(){

  // We parse the BikeNode array
  for(i = 0; i < BikeNode.length; i++){
    connection.query('UPDATE test.BikeStops ' + 
                     'SET NodeId = ' + BikeNode[i].id + ' ' +
                     'WHERE BikeStop_id = ' + BikeNode[i].idStop,
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
  }
}

/**
* This function add the columns NodeId to the MetroStops Table
*/

function upDateMetroStopsTable(){

  // We parse the MetroNode aray
  for(i=0; i < MetroNode.length; i ++){
    connection.query('UPDATE test.MetroStops ' + 
                     'SET NodeId = ' + MetroNode[i].id + ' ' + 
                     'WHERE MetroStop_id = ' + MetroNode[i].idStop,

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
  }

}