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

// Variable to get asyncronous function synchonous
var async = require('async');

// Variable of node
var BikeNode = new Array();
var BusNode = new Array();
var MetroNode = new Array();
var TrainNode = new Array();


// Variable
var bikeNodeDone = false;
var busNodeDone = false;
var metroNodeDone = false;

// Then we create all the node




// Create nodes for bike Stops
function createBikeNode(){
var query = connection.query('SELECT * FROM BikeStops', function(err, result){
		
	// Case there is an error
	if(err){
		console.log("An error Occured during the creation of BikeStop nodes");
	} 
	
	// Case of success
	else{
		
		// We parse the result and create each node
		for(i=0; i < result.length; i++){
			
			// Create the node
			 BikeNode[i] = db.insertNode({Name: result[i].BikeStop_name, id: result[i].BikeStop_id, Lat: result[i].BikeStop_lat, Lng: result[i].BikeStop_lon, type: "Bike"}, 
			 	
			 	// Callback (function which callend when the insertNode function is done)
			 	function(err, node){

			 		// Case of error
			 		if(err){
			 			console.log("An error occured");
			 		} else
			 		console.log("BikeNode created : " + node.id);
			 	});
			 if(i == result.length){
			 	bikeNodeDone = true;
			 }
		}
		
	}	
	
});
}

// Create nodes for bus Stops
function createBusNode(){
var query = connection.query('SELECT * FROM BusStops', function(err, result){
	
	// Case there is an error
	if(err){
		console.log("An error Occured during the creation of BusStop nodes");
	} 
	
	// Case of success
	else{
		
		// We parse the result and create each node
		for(i=0; i < result.length; i++){
			
			// Create the node
			 BusNode[i] = db.insertNode({Name: result[i].Stop_name, id: result[i].Stop_id, Lat: result[i].Stop_lat, Lng: result[i].Stop_lon, type:"Bus"},
			 
			 	// Callback (function which callend when the insertNode function is done)
			 	function(err, node){

			 		// Case of error
			 		if(err){
			 			console.log("An error occured");
			 		} else
			 		console.log("BusNode created : " + node.id);
			 	});
			 if (i == result.length) {
			 	busNodeDone = true;
			 };

		}
		
	}	
	
});
}

// Create nodes for Metro Stops

function createMetroNode(){
var query = connection.query('SELECT * FROM MetroStops', function(err, result){

	// Case there is an error
	if(err){
		console.log("An error Occured during the creation of MetroStops nodes");
	} 
	
	// Case of success
	else{
		
		// We parse the result and create each node
		for(i=0; i < result.length; i++){
			
			// Create the node
			 MetroNode[i] = db.insertNode({Name: result[i].MetroStop_name, id: result[i].MetroStop_id, Lat: result[i].MetroStop_lat, Lng: result[i].MetroStop_lon, type:"Metro"},
			 	
			 	// Callback (function which callend when the insertNode function is done)
			 	function(err, node){

			 		// Case of error
			 		if(err){
			 			console.log("An error occured");
			 		} else
			 		console.log("MetroNode created : " + node.id);
			 	});
			 if(i == result.length){
			 	metroNodeDone = true;
			 }
		}
		
	}		
});
}

