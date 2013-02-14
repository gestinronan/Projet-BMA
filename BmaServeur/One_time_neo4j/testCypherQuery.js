/******************
* filename: TESTGraphQuery.js
* date: 08/01/13
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file do a query against the graph using the cypher language

// Connection mySql DataBase  
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Connection Neo4j database
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

// Variable needed to use jquery
var $ = require('jquery');

// Global variable

var nodes = new Array();
var relations = new Array();
var relationParameter = new Array();
var nodeParameter = new Array();

/** Cypher query which will be executed 
 	
	START d=node(47), e=node(98)
	MATCH p = allShortestPaths( d-[*..15]->e )
	RETURN p;
*/

db.cypherQuery("START d=node(47), e=node(98) " +
			   "MATCH p = allShortestPaths( d-[*..50]->e ) " +
               "RETURN p", function(err,result){
			   	// Case of error 
			   	if(err || !result){
			   		console.log("An error Occured :: " + err);
			   		throw err;
			   	}

			   	// Else Display the data into the console
			   	else {

			   		//console.log(result.data);
			   		// Read the data
			   		nodes = result.data[0].nodes;
			   		relations = result.data[0].relationships;

			   		// Call the method to get the relation parameters
			   		readRelationship(relations);
			   	
			   	}

});

/**
* This function read relation ship
*/
function readRelationship(relations){
	var i=0;
	var x =0;
	// Parse all the relation 
	for(i = 0; i<relations.length; i++){

		// Split the realtion into an array
		var temp = relations[i].split('/');

		// Extract the ID
		var idRelation = temp[temp.length -1 ];

		// Read the relation 
		db.readRelationship(idRelation, function(err, result){

			// Case an error occured reading the realtionship
			if(err || !result){
				console.log('An error occured getting relationship parameters :: ' + err );
			} else {
				
				relationParameter[x] = result; // Store the data
				// If it's done, we call the next function which will read all the nodes
				


				if(x == relations.length -1){
					for(j=0; j<relationParameter.length; j++)	
						console.log(relationParameter[j]);
					//readNode(nodes);
				}
				x ++ ;
			}
		});
	}
}

/**
* This function read nodes
*/
function readNode(nodes){
	var j =0;
	var y =0;

	// Parse all the nodes
	for(j=0; j<nodes.length; j ++){

		// Split the node into an array
		var temp = nodes[j].split('/');

		// Extracr the ID
		var idNode = temp[temp.length - 1];

	

		// Read the node
		db.readNode(idNode, function(err, result){

			// Case an error occured getting the node parameter
			if(err || !result){
				console.log('An error occured getting node paramaters :: ' + err);
			} else {

				nodeParameter[y] = result;

				// If it's done, we display the result
				if(y == nodes.length -1){
					displayResult();
				}
				y++;
			}
		});
	}
}


/**
* This function is used to display the result
*/
function displayResult(){

	//console.log(nodeParameter[0].data.type);
	//console.log(nodeParameter[1].data.Name);

		
	// We parse all the node Id
	for(var i = 0; i< nodeParameter.length; i++){

		// display the node
		console.log('Etape ' + i + ' Arret de :: ' + nodeParameter[i].data.type + ' name :: ' + nodeParameter[i].data.Name);
		
		// Display the relation
		if(relationParameter.length > i ){
			console.log('Trajet ' + i + ' de type :: ' + relationParameter[i].type + ' pour une durée de :: ' + relationParameter[i].data.time/60 + 'min');
		}
	}

}