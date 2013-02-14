
/***************************
 * Fichier Serveur projet BMA
 * Date: 24/11/12
 * Version: 1.0
 * Author: Guillaume Le Floch
 * Contact: glfloch@gmail.com
 ***************************/

 /********* Variable utilisé par le serveur *********/

// Variable nécéssaire a la création du serveur
var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path');

// Jquery variable
var $ = require('jquery');

var app = express();

/********* Définition des API que l'on contact *******/

// Variable de contact pour le site de la star
var api_star = http.createClient(80, "http://data.keolis-rennes.com/json/");
var version = "2.0";
var key_star = "FR6UMKCXT1TY5GJ";

/****** Variable ********/
var data;

/******* Android varaible ****/
var androidLat, androidLng;

/******* Variable to store path *******/
var relationParameter = new Array();		// Store relation of a route
var nodeParameter = new Array();			// Store nodes of a route 
	
/*********** Connection to Databases ***********/

// Variables needed for the database connection
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

var connectionMultiple = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');
connectionMultiple = mysql.createConnection({multipleStatements: true}); // Enable the multiquery option

// Connection Neo4j database
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

/********* Configuration du serveur ***********/

// Configuration du serveur 
app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

/******* Création du serveur ********/

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});


/********* Allow Cross Domain Ajax call ***********/
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/************* Get Request for the bike stations ********/

// This is the function which manage a get call on '/' (That's the first page which is load)
app.get('/test/bike',function(req, res){
	
	var url = "http://data.keolis-rennes.com/json/?version=" + version + "&key=" + key_star + "&cmd=getbikestations";
	
	// Call the getData function
	getData(url, req, res, "bike");

});


/************* Get Request for the metro stations from mysql database ********/

app.get('/test/metro', function(req, res){
	
	// Get the data from the table Metro_Stop
	
	connection.query('SELECT * FROM MetroStops', function(err, result){
		
		// Pass the data to the metro template
		res.render('metro', {
			data: result
		})
	});
});

/*********** Get request for the bus Stations from the mysql database ***/
app.get('/test/bus', function(req, res){

    // Get the data from the BusStops table
   
    connection.query('SELECT * FROM BusStops', function(err, result){

        // Pass the data to the template
        res.render('bus', {
        	data: result
        })
    });
});


/********** Get request for the boren electric from the mysql database ****/
app.get('/test/borneelec', function(req, res){

	
	connection.query('SELECT * FROM test.BorneElec', function(err, result){

		res.render('borneelec', {
			data: result
		})
	});
});

/*********** Get request for the Train Stations from the mysql database ***/
app.get('/test/train', function(req, res){

    // Get the data from the BusStops table
   
    connection.query('SELECT * FROM TerStops', function(err, result){

        // Pass the data to the template
        res.render('train', {
        	data: result
        })
    });
});


/********* GET request for the testGraph view, this return the list of all Stops *****/
app.get('/test/testgraphe', function(req, res){

//Variable
var busData = null;
var bikeData = null;
var metroData = null;
var trainData = null;

// First query to get the busStops
connection.query('SELECT * FROM test.BusStops', function(err, result){
	busData = result;

	if(busData != null && bikeData != null && metroData != null && trainData != null){
		res.render('testgraphe',{
					 		dataBus: busData,
					 		dataBike: bikeData,
					 		dataMetro: metroData,
					 		dataTrain: trainData
					 	})
	}
});

// Second query to get the bikeStops
connection.query('SELECT * FROM test.BikeStops', function(err, result){
	bikeData = result;

	if(busData != null && bikeData != null && metroData != null && trainData != null){
		res.render('testgraphe',{
					 		dataBus: busData,
					 		dataBike: bikeData,
					 		dataMetro: metroData,
					 		dataTrain: trainData
					 	})
	}
});

// Third query to get the metro Stops
connection.query('SELECT * FROM test.MetroStops', function(err, result){
	metroData = result;

	if(busData != null && bikeData != null && metroData != null && trainData != null){
		res.render('testgraphe',{
					 		dataBus: busData,
					 		dataBike: bikeData,
					 		dataMetro: metroData, 
					 		dataTrain: trainData
					 	})
	}
});

// Third query to get the metro Stops
connection.query('SELECT * FROM test.TerStops', function(err, result){
	trainData = result;

	if(busData != null && bikeData != null && metroData != null && trainData != null){
		res.render('testgraphe',{
					 		dataBus: busData,
					 		dataBike: bikeData,
					 		dataMetro: metroData,
					 		dataTrain: trainData
					 	})
	}
});

});


/********* POST request for the testGraph view, this return the graph query result*****/
app.post('/test/testgraphe', function(req, res){

	console.log(req.body.depart);

	// Get the data from the request

	// Parse the depart data
	var tempD = req.body.depart;
	var tempDepart = tempD.split(':');
	var departType = tempDepart[0];
	var depart = tempDepart[1];
	console.log("id Depart ::  " + depart);
	

	// Parse the arrive data
	var tempA = req.body.arrive;
	var tempArrive = tempA.split(':');
	var arriveType = tempArrive[0];
	var arrive = tempArrive[1];

	console.log("id arrive :: " + arrive);
	
	// Parse the rest
	var bus = req.body.bus;
	var bike = req.body.bike;
	var metro = req.body.metro;

	// Convert data into table name
	var departTable;
	var arriveTable;
	var arriveColumns;
	var departColumns;

	// Variable
	var id_depart = null;
	var id_arrive = null;

	
	if(departType == 'Bus'){
		departTable = 'test.BusStops';
		departColumns = 'Stop_id';
		depart = "\'" + depart + "\'";
	}
	else if(departType == 'Bike'){
		departTable = 'test.BikeStops';
		departColumns = 'BikeStop_id';
	}
	else if(departType == 'Metro'){
		departTable = 'test.MetroStops';
		departColumns = 'MetroStop_id';
		depart = "\'" + depart + "\'";

	} else if(departType == 'Train'){
		departTable = 'test.TerStops';
		departColumns = 'Stop_id';
	}

	if(arriveType == 'Bus'){
		arriveTable = 'test.BusStops';
		arriveColumns = 'Stop_id';
		arrive = "\'" + arrive + "\'";
	}
	else if(arriveType == 'Bike'){
		arriveTable = 'test.BikeStops';
		arriveColumns = 'BikeStop_id';
	}
	else if(arriveType == 'Metro'){
		arriveTable = 'test.MetroStops';
		arriveColumns = 'MetroStop_id';
		arrive = "\'" + arrive + "\'";

	} else if(arriveType == 'Train'){
		arriveTable = 'test.TerStops';
		arriveColumns = 'Stop_id';
	}
	
	connection.query('SELECT NodeId FROM ' + departTable + ' WHERE ' + departColumns + ' = ' + depart,
					  function(err, result){

					  	// Case of error during the call
					  	if(err || !result){
					  		console.log('An error occured getting the depart');
					  	}
					  	console.log(result);
					  	id_depart = result[0].NodeId;

					  	/***** DEBUG ******/
					  	console.log('table :: ' + arriveTable);
					  	console.log('Columns :: ' + arriveColumns);

						connection.query('SELECT NodeId FROM ' + arriveTable + ' WHERE ' + arriveColumns + ' = ' + arrive,
					  		function(err, result){

					  			// Case of error during the call
					  			if(err || !result){
					  				console.log('An error occured getting the arrive');
					  			}
					  			console.log('result arrive query :: ' + result);
					  			id_arrive = result[0].NodeId;

					  			console.log("Do cypher query nodedepart :: " + id_depart + "; nodearrive :: " + id_arrive);

					  			// Run a cypher query against the grapj
								db.cypherQuery("START d=node(" + id_depart + "), e=node(" + id_arrive + ") " +
					  				   "MATCH p = shortestPath( d-[*..20]->e ) " +
                       				   "RETURN p", function(err,data){

                       				   	// Case an error occured
                       				   	if(err || !result){
                       				   		console.log('An error occured when querying the graph');
                       				   	}
			   							
			   							// Result of the query
			   							readCypherData(res, data.data[0].nodes, data.data[0].relationships);
								});

					 	 });
					  });	

});



/************ Example of an other get Request *********/

app.post('/android',function(req, res){
	
	console.log("Android get Request");
	
	
});

/******** Post request **********/


// This is a post request (What the phone or the website will send us)
app.post('/android/data', function(req, res){
	
	// We first get the parameter sent in the request
	androidLat = req.body.latitude; // Here we get the latitude
	androidLng = req.body.longitude; // Here we get the longitude
	
	// Display the response
	console.log("Longitude: " + androidLng);
	console.log("Latitude: " + androidLat);
	
	// Then we get the data 
	var url = "http://data.keolis-rennes.com/json/?version=2.0&key=" + key_star + "&cmd=getbikestations";
	getData(url, req, res, "android/data");	
});

// This is a post request from the phone to get the next departure for a bus
app.post('/android/nextdeparture', function(req, res){

	// Get the bus ID from the post request
	stopId = req.body.stopId;

	// Url to get the next departure 
	var url = "http://data.keolis-rennes.com/json/?cmd=getbikestations&version=2.1&key=" + key_star + "&param%5Bmode%5D=stop&param%5Bstop%5D%5B%5D=" + stopId;
});

/*************************************************************************************************/
/*********************************** Android get Request *****************************************/
/*************************************************************************************************/


// This send the bike data to the android app
app.get('/android/data/bike', function(req, res){
	
	// Url to get the bike data
	var url = "http://data.keolis-rennes.com/json/?version=2.0&key=" + key_star + "&cmd=getbikestations";
	
	// Make an ajax request to the Keolis API
	getData(url, req, res, "android/data/bike");
	
});

// This send the bus data to the android app
app.get('/android/data/bus', function(req, res){
	
	// Get the data from the BusStops table
	connection.query('SELECT Stop_id, Stop_name, Stop_lat, Stop_lon, Line_short_name FROM BusStops', function(err, result){
		
		var jString = JSON.stringify(result);
		
		res.send(jString);
	});
});

app.get('/android/data/metro', function(req, res){

	// Database query
	connection.query('SELECT * FROM MetroStops', function(err, result){
		
		// Send the data
		var jString = JSON.stringify(result);
		
		res.send(jString);
	})
});

// This send the train data to the android app
app.get('/android/data/train', function(req, res){
	// Database query
	connection.query('SELECT * FROM TerStops', function(err, result){
		
		// Send the data
		var jString = JSON.stringify(result);
		
		res.send(jString);
	})
});

// This send the BorneElectrique data to the android app
app.get('/android/data/borneelec', function(req, res){

	// Database Query
	connection.query('SELECT * FROM test.BorneElec', function(err, data){

		// send the data

		var string = JSON.stringify(data);
		res.send(string);
		})
});


/*************************************************************************************************/
/*********************************** Android Post Request ****************************************/
/*************************************************************************************************/

app.post('/android/data/getroutes', function(req, res){

	// Variable which will be used to store NodeId
	nodeIdDepart = null;
	nodeIdArrive = null;

	// Get the parameter from the post Request
	var departData = req.body.depart;
	var arriveData = req.body.arrive;

	console.log(req.body);

	// Split the data to extract all the parameters
	var tempDepart = departData.split(':');
	var tempArrive = arriveData.split(':');

	// Put the data into variable
	var departType = tempDepart[0]; // Get the transport type (bike, bus ...)
	var arriveType = tempArrive[0];	// Get the transport type (bike, bus ...)
	var idDepart = tempDepart[1]; 	// Get the ID 
	var idArrive = tempArrive[1]; 	// Get the ID
    
    // DEBUG
    console.log("depart :: " + idDepart);
    console.log("arrive :: " + idArrive);

	// Declare variable for the sql table to query
	var departTable = null;
	var arriveTable = null;
	var departColumns = null;
	var arriveColumns = null;

	// Set the table to query in order to get the node Id
	if(departType == 'Bus'){
		departTable = 'test.BusStops';
		departColumns = 'Stop_id';
		idDepart = "\'" + idDepart + "\'";
	} else if(departType == 'Bike'){
		departTable = 'test.BikeStops';
		departColumns = 'BikeStop_id';
	} else if(departType == 'Metro'){
		departTable = 'test.MetroStops';
		departColumns = 'MetroStop_id';
		idDepart = "\'" + idDepart + "\'";
	}

	if(arriveType == 'Bus'){
		arriveTable = 'test.BusStops';
		arriveColumns = 'Stop_id';
		idArrive = "\'" + idArrive + "\'";
	} else if(arriveType == 'Bike'){
		arriveTable = 'test.BikeStops';
		arriveColumns = 'BikeStop_id';
	} else if(arriveType == 'Metro'){
		arriveTable = 'test.MetroStops';
		arriveColumns = 'MetroStop_id';
		idArrive = "\'" + idDepart + "\'";
	}

	// Once we have the parameters, We get nodes Id from the sql db
	connection.query('SELECT NodeId FROM ' + departTable + ' WHERE ' + departColumns + ' = ' + idDepart, function(err, result){

		// Case there is an error getting the node ID
		if(err || !result){
			console.log('An error Occured getting the sql data :: ' + err);
			
			// Report the error to the app
			res.send('{data: error while getting sql data}');
		} else{

			// Store the nodeId
			nodeIdDepart = result[0].NodeId;

			// If we get the nodeId of the depart, we can get the nodeId of the arrive
			connection.query('SELECT NodeId from ' + arriveTable + ' WHERE ' + arriveColumns + ' = ' + idArrive, function(err, result){

				// Case an erroc occured durung the call
				if(err || !result){
					console.log('An error Occured getting the second SQL data');

					// Report the error to the app
					res.send('{data: error getting nodeId in sql table}');
				} else{

					// Store the Node ID
					nodeIdArrive = result[0].NodeId;

					// Once we have those parameters, we can query the graph tp get the shortest path
					getShortestPath(nodeIdDepart, nodeIdArrive, res);
				}
			});
		}

	});

});


/********* Functions ***********/

// Get Ajax call function, Maybe we will need to add an other parameter 
// to select wether or not we are sending Json or a template.
// Type correspond to the template we are using
function getData(url, req, res, type){
	
	// Appel vers le serveur
	var xhr = $.ajax({
		
		// Parameter
		url: url, // Url uses to make the call
		dataType: 'json',  // Type of data we receive
		success: function(data){
			data = data;
			// Function call in case of success call.
			//console.log(data.opendata);	
			
			// Case of a bike station
			if(type == "bike"){
				
				// Parse the Json
				for (i=0; i <data.opendata.answer.data.station.length; i++){
					//console.log(data.opendata.answer.data.station[i]);
				}	
				res.render('index', {
					data: data
				})	
			} 
			
			// Case of android without data 
			else if(type == "android/data/bike"){
				var station = data.opendata.answer.data.station;
				
				var jString = JSON.stringify(data);
		
				res.send(jString);
				
			}

			// Case the app request the next departure for a busStop
			else if(type == "android/nextdeparture"){
				res.send(data);
			}
			
			// Case of android with data
			else if(type == "android/data"){
				
				res.send(data);
			}
		},
		error: function(){
			
			// Function call in case of error during the call.
		}
	});
}




/**
* This Fucntion query the graph to get the shortest path between to node Id and return the result
*/
function getShortestPath(depart, arrive, res){

	/* 
	Query the graph thanks to a Cypher Query
	Cypher is a language like SQL.

	Here is the query we will excute to get the all the shortestpath between those two nodes
	
	START d=node(47), e=node(98)
	MATCH p = allShortestPaths( d-[*..15]->e )
	RETURN p;
	
	In this query, we get all the shortest path between the ndoe 47 and the node 98
	*/

	db.cypherQuery('START d=node(' + depart + '), e=node(' + arrive + ') '+
				   'MATCH p = allShortestPaths( d-[*..30]->e ) ' +
				   'RETURN p', function(err, data){

				   	// Case an error occured querying the graph
				   	if(err || !data){
				   		console.log('An error occured getting the data :: ' + err);

				   		// Report the error to the app
				   		res.send('{data: An error Occured getting the shortest path');
				   	} else {

				   		// Once we get the result from the cypher query against the graph we parse the data
				   		// And call a method which will parse and extract all the data
				   		readCypherData(res, data.data[0].nodes, data.data[0].relationships);
				   		
				   	}
				   });

}


/**
* This function Read all the data coming from the cypher query
*/
function readCypherData(res, nodes, relations){

// Call the function which will parse the relationship data
readRelationship(res, nodes, relations);



}

/**
* This function read relation ship
*/
function readRelationship(res, nodes, relations){
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
				console.log(result);
				relationParameter[x] = result; // Store the data
				
				// If it's done, we call the next function which will read all the nodes
				if(x == relations.length - 1){
					
					readNode(res, nodes, relations);
					
				}
				x ++ ;
			}
		});
	}
}


/**
* This function read nodes
*/
function readNode(res, nodes, relations){
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
					
					// Once it's Done, we pass the data thanks to the res
					
					// Create the json 
					//var jsonData = {nodes: nodeParameter, relations: relationParameter};
					//res.send(jsonData);

					// Edit the relations array to add each sql node id in it
					
					var j=0;
					for(z=0; z<relationParameter.length; z++){

						console.log("node: " + nodes[j]);

						// Get the start node ID
						var Start_Stop_id = nodes[j].data.idStop;
						j++;
						var End_Stop_id = nodes[j].data.idStop;
						j++;

						// Edit the json response
						relationParameter[z].Start_Stop_id = Start_Stop_id;
						relationParameter[z].End_Stop_id = End_Stop_id;

						// When it's done 
						if(z == relationParameter.length -1){

							// Creates a JSON String
							var jsonData = {relations:relationParameter};
							console.log(relationParameter);
							res.send(jsonData);
						}

					}




				}
				y++;
			}
		});
	}
}
