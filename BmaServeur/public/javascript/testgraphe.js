/**
* This file contains the javascript code used in the testGraphe template
*/

// Url use for the post request
var urlPost = "http://localhost:3000/testgraphe";

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
			

			// Display the result
			for(var i = 0; i<data.nodes.length; i++){

				// Diplay the first node 
				$('#tableau').append('<tr>');

				// Display a node
				$('#tableau').append('<td>' + data.nodes[i].data.Name + ' (' + data.nodes[i].data.type + ') </td>');

				// Check if the relationship is present
				if(data.relations.length > i){
					var j = i+1;
					$('#tableau').append('<td>' + data.relations[i].data.time / 60 + 'min (' + data.relations[i].type + ') </td>');
					$('#tableau').append('<td>' + data.nodes[j].data.Name + ' (' + data.nodes[j].data.type + ') </td>');
				}

				$('#tableau').appent('</tr>');
			}

			console.log(data);


		},
		error: function(data){
			// Case of an error during the post request
		}

	}) 


}