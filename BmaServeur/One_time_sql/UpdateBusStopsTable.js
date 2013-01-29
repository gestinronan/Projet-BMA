/******************
* filename: UpdataBusStopsTables.js
* data: 05/12/12
* author: Guillaume Le Floch
* version: 1.0
******************/

///////////////////////////////////////////////////////////////////////////
/////////// This Script add line stop to the BusStops Table ///////////////
///////////////////////////////////////////////////////////////////////////

// Variables needed for the database connection
var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=false');

// Varaible that store the Stop_id
var BusStop_id = new Array();

// We make a join in SQL which correspond to this SQL query (join the stop_id with route_short_name and routes_long_name)

// SELECT BusStops.*, BusTrips.*, BusRoutes.*, BusStop_Times.*
// FROM BusStops AS busStops, BusTrips AS busTrips, BusStop_times As busStop_Times, BusRoutes AS busRoutes
// WHERE busStops.Stop_id = busStop_times.Stop_id
// AND busStop_Times.Trip_id = busTrips.Trip_id
// AND busTrips.Route_id = busRoutes.Route_id;

// Before doing the join, we select all the busStop_id in an array, then we do a join query with this Id, 
// built an array with the route_short_name and route_long_name and update the BusStops table.
connection.query("SELECT test.BusStops.Stop_id FROM test.BusStops", function(err, result){
		
	// Case there is an error
	if(err){
		console.log(err);
		
		// Exit the script
		process.exit(0);
	}
	
	else{
		
		// Call the function to do the join request
		joinRequest(result);
	}
});


// Function which depending of the stop_id make a join request
function joinRequest(stop_id_array){

// For each stop_id we do a join to find the route_id.
for(i=0; i < stop_id_array.length; i++){

connection.query('SELECT BusStops.Stop_id, BusTrips.Trip_id, BusTrips.Route_id, BusRoutes.Route_id, BusRoutes.Route_long_name, ' +
				 "BusRoutes.Route_short_name, BusStop_times.Stop_id, BusStop_times.Trip_id " + 							// We select what we need
				 "FROM BusStops AS busStops, BusTrips AS busTrips, BusStop_times As busStop_times, BusRoutes AS busRoutes " + // We Use shorter name
				 "WHERE busStops.Stop_id = " + stop_id_array[i].Stop_id +  // We pick the right stop_id
				 "AND busStops.Stop_id = busStop_times.Stop_id " + // We join the BusStops table with the BusStop_Times Table by Stop_id
				 "AND busStop_times.Trip_id = busTrips.Trip_id " + // We join the BusStop_Times Table with the BusTrips Table by Trip_id
				 "AND busTrips.Route_id = busRoutes.Route_id",  // We join the BusTrips Table with the BusRoutes table by Route_id
			 
				 // This is the result of the query
			 	 function(err, result){
			 	 	
					 // Case there is an error
					 if(err){
						 console.log('An error Occured :' + err);
						 process.exit(1); // We exit the script
					 } 
					 else{
					 	
						 // Else we use the result to upate the BusStops Table
			
						 // We store the route_long_name route_short_name in arrays
						 var line_long_name = new Array();
						 var line_short_name = new Array();
						 var line_id = new Array();
						 
						 // Wa parse the result 
						 for(j=0; j < result.length; j ++){
							 
							 // Var which define if we add the data or not
						 	 var saveData = false; 
							 
							 // If the line_id is in the array we don't add it 
							 for(k=0; k < line_id.length; k++){
								 
								 // if the data is already in the table, we don't it
								 if(result[j].Route_id === line_id[k]){
									 saveData = true;
								 }
							 }
							 
							 // if the data aren't in the database, we add them to the array
							 if(saveData === false || line_id.length === 0){
							 	
								 // We add the line informations to the array
								 line_id[line_id.length] = result[j].Route_id;
								 line_short_name[line_short_name.length] = result[j].Route_short_name;
								 line_long_name[line_long_name.length] = result[j].Route_long_name; 
							 }
						 }
						 
						 
						 // Check if there is data to save
						 
						 if(line_id.length != 0){
						 	
							//
							console.log(line_short_name);
							
							// Once we parsed the response, we save the array in the BusStops table
						 	connection.query("UPDATE BusStops SET Line_id = " + line_id.join(';') + 
						 				  	", Line_short_name = " + line_short_name.join(';') + 
									      	//", Line_long_name =  "+ line_long_name.join(';') + 
									  	  	" WHERE BusStops.Stop_id = \'" + result[0].Stop_id + "\' ", 
											  function(err, result){
									  	  	
											  // Case there is an error 
											  if(err){
											  	console.log(err);	  
											  }
								});
						}
					 }
					 
					
			 	 });
		
		
				 
		}
		
		// Once all the stop_id are parsed, we end the script
		//process.exit(0);
}
