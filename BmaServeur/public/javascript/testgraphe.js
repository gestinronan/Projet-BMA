/**
* This file contains the javascript code used in the testGraphe template
*/

// This function do a post request to the server containing the info for the grah research

function callServer(){

	// Hide the result div
	$('#result').hide();

	// Get the data
	var depart = $('#depart');
	var arrive = $('#arrive');
	var bus = $('#bus');
	var bike = $('#bike');
	var metro = $('#metro');

	// Put the data together
	var data = {'depart': depart, 'arrive':arrive, 'bike': bike, 'bus': bus, 'metro': metro};

	// Make the post request
	$.ajax({
		url: '148.60.11.208:3000/testgraphe/post',
		type: 'POST',
		data: data,
		success: function(data){

			// Case of a success call
			// Display the result div
			$('#result').show();
		},
		error: function(data){
			// Case of an error during the post request
		}

	}) 


}