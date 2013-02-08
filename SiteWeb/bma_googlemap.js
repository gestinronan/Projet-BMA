var googlemap;
var geocoderService = new google.maps.Geocoder();
var directionsService = new google.maps.DirectionsService();

var map_defaut_options = {
// Vue plan par défaut
mapTypeId : google.maps.MapTypeId.ROADMAP,

// Point visé par défault
zoom : 15,
center : new google.maps.LatLng(48.110974, -1.680268, true),

// Options par défaut du menu
mapTypeControlOptions : {
position : google.maps.ControlPosition.RIGHT_BOTTOM,
style : google.maps.MapTypeControlStyle.DROPDOWN_MENU
},

// Options par défaut du contrôle de navigation
navigationControlOptions : {
position : google.maps.ControlPosition.TOP_RIGHT,
style : google.maps.NavigationControlStyle.SMALL
}
};

/*******************************************************************************
 * Initialisation de la Google Map
 ******************************************************************************/
 
 
 /*
 
 var previousPosition = null;
	
		function initializeGoogleMap() {
			map = new google.maps.Map(document.getElementById("map_canvas"), {
			      zoom: 19,
			      center: new google.maps.LatLng(48.858565, 2.347198),
			      mapTypeId: google.maps.MapTypeId.ROADMAP
			    });		
		}
		  
		if (navigator.geolocation)
			var watchId = navigator.geolocation.watchPosition(successCallback,
																null,
																{enableHighAccuracy:true});
		else
			alert("Votre navigateur ne prend pas en compte la g olocalisation HTML5");
			
		function successCallback(position){
			map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
				map: map
			});  
			if (previousPosition){
				var newLineCoordinates = [
											 new google.maps.LatLng(previousPosition.coords.latitude, previousPosition.coords.longitude),
											 new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
										   ];
				
				var newLine = new google.maps.Polyline({
					path: newLineCoordinates,	       
					strokeColor: "#FF0000",
					strokeOpacity: 1.0,
					strokeWeight: 2
				});
				newLine.setMap(map);
			}
			previousPosition = position;
		};	*/
function initializeGoogleMap() {




	googlemap = new google.maps.Map(document.getElementById("map"), map_defaut_options);
}
// google.maps.event.addDomListener(window, 'load', initializeGoogleMap);

/*******************************************************************************
 * Géocodage : Retourne la latitude et la longitude de l'adresse fournie
 ******************************************************************************/
function getGoogleMapLatLng(address, element) {
	geocoderService.geocode({
		'address' : address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			itinerennes_manager.hideSearchPolyline();
			var latlng = results[0].geometry.location;
			var etape = new Etape(latlng.lat(), latlng.lng());
			etape.address = results[0].formatted_address;
			etape.type = "user";

			if (element.id == "pos-depart") {
				itinerennes_manager.search_steps[0] = etape;
			} else if (element.id == "pos-arrivee") {
				itinerennes_manager.search_steps[5] = etape;
			} else {
				var el_id = $(element).attr('id').toString().charAt($(element).attr('id').toString().length - 1);
				el_id = parseInt(el_id);
				itinerennes_manager.search_steps[el_id + 1] = etape;
			}
			$(element).val(results[0].formatted_address);

			for (i in itinerennes_manager.search_steps) {
				if (itinerennes_manager.search_steps)
					itinerennes_manager.search_steps[i].refreshIcon();
			}
			itinerennes_manager.showSearchPolyline();
			itinerennes_manager.zoomTo();
		} else {
			showError("Erreur de géolocalisation (" + status + ").", '#trouvez');
		}
	});
}

/*******************************************************************************
 * Géocodage : Retourne l'adresse �  la latitude et �  la longitude fournie
 ******************************************************************************/
function getGoogleMapAddress(position, callback) {
	geocoderService.geocode({
		'latLng' : position
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			callback(results[0]);
		} else {
			showError("Erreur de géolocalisation (" + status + ").", '#trouvez');
		}
	});
}
function LatLong(degLat, degLong) {
	this.lat = LatLong.llToRad(degLat);
	this.lon = LatLong.llToRad(degLong);
}
LatLong.llToRad = function(brng) {
	if (!isNaN(brng))
		return brng * Math.PI / 180;

	brng = brng.replace(/[\s]*$/, '');
	var dir = brng.slice(-1).toUpperCase();
	if (!/[NSEW]/.test(dir))
		return NaN;
	brng = brng.slice(0, -1);
	var dms = brng.split(/[\s:,Â°Âºâ€²\'â€³\"]/);
	switch (dms.length) {
	case 3:
		var deg = dms[0] / 1 + dms[1] / 60 + dms[2] / 3600;
		break;
	case 2:
		var deg = dms[0] / 1 + dms[1] / 60;
		break;
	case 1:
		if (/[NS]/.test(dir))
			brng = '0' + brng;
		var deg = brng.slice(0, 3) / 1 + brng.slice(3, 5) / 60 + brng.slice(5) / 3600;
		break;
	default:
		return NaN;
	}
	if (/[WS]/.test(dir))
		deg = -deg;
	return deg * Math.PI / 180;
};
LatLong.distHaversine = function(p1, p2) {
	var R = 6371;
	var dLat = p2.lat - p1.lat;
	var dLong = p2.lon - p1.lon;

	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat) * Math.cos(p2.lat) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;

	return d;
};