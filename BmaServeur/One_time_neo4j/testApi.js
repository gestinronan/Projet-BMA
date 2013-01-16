
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
		console.log("Distance by cloudmade: " + data.route_summary.total_distance/1000 + "km");
		console.log("Time by cloudmade: " + data.route_summary.total_time * 60 + "min");


		getApproximativeFootDistance(pointA, pointB);

	},
	error: function(err){
		console.log(err);
	}
});


function getApproximativeFootDistance(pointA, pointB){

  // Rayon de la terre
  var rayonTerre = 6366;

  // We get latitude and longitude from the two points
  var latA = pointA.lat;
  var lngA = pointA.lon;
  var latB = pointB.lat;
  var lngB = pointB.lon;

  // We convert the degree value into radian value
  latA = (Math.PI * latA)/180;
  lngA = (Math.PI * lngA)/180;
  latB = (Math.PI * latB)/180;
  lngB = (Math.PI * lngB)/180;

  // Precise distance
  var dist = 2 * Math.asin(Math.sqrt(Math.pow (Math.sin((latA-latB)/2), 2) + Math.cos(latA) * Math.cos(latB) * Math.pow( Math.sin((lngA-lngB)/2), 2)));

  // Convert the distance in Kilometer
  var distKm = dist * rayonTerre;

  console.log("Distance approximative: " + distKm + "km");
}