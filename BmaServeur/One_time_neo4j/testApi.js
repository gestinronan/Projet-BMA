
// Variable needed to use jquery
var $ = require('jquery');

// Variable needed to use the cloudmade api (http://developers.cloudmade.com/projects/routing-http-api/examples)
var url = 'http://routes.cloudmade.com/';
var api_key = 'adacc34c3ee24c11871eb269433ad33b';


var pointA = {lat:'48.10999', lon:'-1.678027'};
var pointB = {lat:'48.11817', lon:'-1.670735'};


var urlFinal = url + api_key + '/api/0.3/' + pointA.lat + ',' + pointA.lon + ',' + pointB.lat + ',' + pointB.lon + '/bicycle.js';

// Ajax call
$.ajax({
	url: urlFinal,
	success: function(data){
		console.log(data.route_summary.total_distance);
		console.log(data.route_summary.total_time);
	},
	error: function(err){
		console.log(err);
	}
});
