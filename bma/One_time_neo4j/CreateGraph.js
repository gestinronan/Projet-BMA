/******************
* filename: CreateGraph.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file create the graph needed to built the route directions

// Connection mySql DataBase  
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=true');

// Connection Neo4j database
var graph = new neo4j.GraphDatabase("http://localhost:7474");

// Variable of node
var BikeNode = new Array();
var BusNode = new Array();
var MetroNode = new Array();
var TrainNode = new Array();

// Then we create all the node

// Create nodes for bike Stops
connection.query('SELECT * FROM Bike_Stops', function(err, result){
		
	// Case there is an error
	if(err){
		console.log("An error Occured during the creation of BikeStop nodes");
	} 
	
	// Case of success
	else{
		
		// We parse the result and create each node
		for(i=0; i < result.length; i++){
			
			// Create the node
			 BikeNode[i] = graph.node({"Name": result[i].BikeStop_name, "id": result[i].BikeStop_id, "Lat": result[i].BikeStop_lat, "Lng": result[i].BikeStop_lon});
		}
		
	}	
	
});

// Create nodes for bus Stops
connection.query('SELECT * FROM BusStops', function(err, result){
	
	// Case there is an error
	if(err){
		console.log("An error Occured during the creation of BusStop nodes");
	} 
	
	// Case of success
	else{
		
		// We parse the result and create each node
		for(i=0; i < result.length; i++){
			
			// Create the node
			 BusNode[i] = graph.node({"Name": result[i].Stop_name, "id": result[i].Stop_id, "Lat": result[i].Stop_lat, "Lng": result[i].Stop_lon});
		}
		
	}	
	
});

// Create nodes for Metro Stops
connection.query('SELECT * FROM Metro_Stops', function(err, result){

	// Case there is an error
	if(err){
		console.log("An error Occured during the creation of MetroStop nodes");
	} 
	
	// Case of success
	else{
		
		// We parse the result and create each node
		for(i=0; i < result.length; i++){
			
			// Create the node
			 MetroNode[i] = graph.node({"Name": result[i].MetroStop_name, "id": result[i].MetroStop_id, "Lat": result[i].MetroStop_lat, "Lng": result[i].MetroStop_lon});
		}
		
	}		
});


