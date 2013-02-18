/******************
* filename: CreateMetroBikeFootRelation.js
* date: 08/01/13
* author: Guillaume Le Floch
* version: 1.0
******************/


// This file create the relations between each bike Stops and metroStops by foot

// Connection mySql DataBase  
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Connection Neo4j database
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

// Variable needed to use jquery
var $ = require('jquery');

// Local variable
var metroData = new Array();

/**
* Due to the big amount of data, we first get the bus data
* And then we stream the bus stops data, Calcul the time and distance between the streamed data and the data from 
* the array finally we create the relation
*/
connection.query('SELECT * FROM test.MetroStops', function(err, result){

	// Case of error
	if(err){
		console.log('An error occured');
		throw err;
	}
	// Case of success
	else {

    // Once the query is done, we stream the bus data and calcul the relationship
    console.log('First query done!');
    metroData = result;

    CreateMetroRelation();
  }
});

/**
* This function creates the relation between metro stops
*/

function CreateMetroRelation(){

	// DEBUG
	for (x=0; x<metroData.length; x++){
		console.log("Metro stop id: " + metroData[x].MetroStop_id);
	}

	for(i=0; i< metroData.length; i++){

		switch(metroData[i].MetroStop_id){

		// Arret Anatol France
		case "ANF": 
			
			// Get the Saint anne nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "STA"){
					createRelation(2, metroData[i], metroData[j], 'metro');
				}

			}
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "PON"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			break;


		// Arret Le Blosne
		case "BLO":

			// Get the Poterie nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "POT"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "TRI"){
					createRelation(2, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret Charles de Gaules
		case "CDG":

			// Get the Gare nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "GAR"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "REP"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret Gare
		case "GAR":

			// Get the Jacques cartier nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "JCA"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "CDG"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret clémenceau
		case "GCL":

			// Get the Henri Freville nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "HFR"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			// Get the Clemenceau nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "JCA"){
					createRelation(3, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret Henri Fréville
		case "HFR":

			// Get the Italie nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "ITA"){
					createRelation(2, metroData[i], metroData[j], 'metro');
				}

			}
			// Get the Henri Freville nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "GCL"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret Italie
		case "ITA":

			// Get the Triangle nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "TRI"){
					createRelation(2, metroData[i], metroData[j], 'metro');
				}

			}
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "HFR"){
					createRelation(2, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret Jacques cartier
		case "JCA":

			// Get the Clemenceau nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "GCL"){
					createRelation(3, metroData[i], metroData[j], 'metro');
				}

			}
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "GAR"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret John Kenedy
		case "JFK":

			// Get the Villejean nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "VU"){
					createRelation(2, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret Ponchaillou
		case "PON":

			// Get the Anatole France nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "ANF"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "VU"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			break;
		// Arret La Poterie
		case "POT":

			console.log('Arret poterie');
				for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "BLO"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret République
		case "REP":

			// Get the Charles de gaule nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "CDG"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "STA"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret Saint Anne
		case "STA":

			// Get the République nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "REP"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "ANF"){
					createRelation(2, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret triangle
		case "TRI":

			// Get the le blosne nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "BLO"){
					createRelation(2, metroData[i], metroData[j], 'metro');
				}

			}
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "ITA"){
					createRelation(2, metroData[i], metroData[j], 'metro');
				}

			}
			break;

		// Arret Villejean univer
		case "VU":

			// Get the Pontchaillou nodeID
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "PON"){
					createRelation(1, metroData[i], metroData[j], 'metro');
				}

			}
			for(j=0; j<metroData.length; j++){

				if(metroData[j].MetroStop_id === "JFK"){
					createRelation(2, metroData[i], metroData[j], 'metro');
				}

			}
			break;
		}
	}


}

/**
* This function add the relation into the graph 
*/

function createRelation(time, pointA, pointB, type){

  db.insertRelationship(pointA.NodeId, pointB.NodeId, type, {
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
