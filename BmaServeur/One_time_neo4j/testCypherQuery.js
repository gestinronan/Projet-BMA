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

/** Cypher query which will be executed 
* 	
	START d=node(47), e=node(98)
	MATCH p = allShortestPaths( d-[*..15]->e )
	RETURN p;
***************************************/

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
			   		console.log(result);

			   		console.log(result.data[0].nodes);
			   		console.log(result.data[0].relationships);
			   	
			   	}

});