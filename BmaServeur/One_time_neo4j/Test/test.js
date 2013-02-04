/******************
* filename: test.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file create the graph needed to built the route directions

// Connection Neo4j database
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');
db.insertNode({
        name: 'Darth Vader',
        sex: 'male'
    },
    function(err, node){

        // Output Node properties.
        console.log(node.data);

        // Output Node id.
        console.log(node.id);
    });