/**
* This file contains the javascript code used in the testGraphe template
*/

// Url use for the post request
var urlPost = "http://148.60.11.208:3000/testgraphe";

// Variable containing the data
var bus = false;
var bike = false;
var metro = false;
var arrive;
var depart;

// This function do a post request to the server containing the info for the grah research

function callServer(){

	// Hide the result div
	$('#result').hide();

	// Get the data
	depart = $('#depart').val();
	arrive = $('#arrive').val();

	// Get if checkbox are checked or not
	if($('#bus').attr('checked') == true){
		bus = true;
	}
	if($('#bike').attr('checked') == true){
		bike = true;
	}
	if($('#metro').attr('checked') == true){
		metro = true;
	}

	console.log(depart);
	console.log(arrive);
	console.log(bus);
	console.log(bike);
	console.log(metro);

	// Put the data together
	var data = {'depart': depart, 'arrive':arrive, 'bike': bike, 'bus': bus, 'metro': metro};

	// Make the post request
	$.ajax({
		url: urlPost,
		type: 'POST',
		dataType: 'json',
		data: data,
		success: function(data){

			// Case of a success call
			// Display the result div
			$('#result').show();
			$('#result').append('<p>' + data + '</p>');
			console.log(data);
		},
		error: function(data){
			// Case of an error during the post request
		}

	}) 


}