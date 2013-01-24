/******************
* filename: CreateBusRelation.js
* date: 08/01/13
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file create the relations between each bus Stop

// Connection mySql DataBase  
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Connection Neo4j database
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

// Variable needed to use jquery
var $ = require('jquery');




/**
* This function add the relation into the graph 
*/

function createRelation(dist, time, pointA, pointB, type){

  console.log('Create the relation');
  db.insertRelationship(pointA.NodeId, pointB.NodeId, type, {
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
