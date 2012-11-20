///// This Script Is only to save the bus picture into the database //////

// Jquery variable
var $ = require('jQuery');

$.ajax({
	url: "http://data.keolis-rennes.com/json/?version=2.0&key=FR6UMKCXT1TY5GJ&cmd=getlines",
	dataType: 'json',
	success: function(data){
		
		// This get all the pictograms for each lines
		console.log(data.opendata.answer.data);
	},
	error: function(e){
		
	}
})