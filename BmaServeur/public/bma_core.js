// Url use for the post request
var urlPost = "http://localhost:3000/test/testgraphe";
var bus = false;
var bike = false;
var metro = false;
var arrive;
var depart;

var itinerennes_manager = new ItinerennesManager();
$(document).ready(function() {
	itinerennes_manager.initialize();
});

function refreshGlobalStatistics(distance, number, users) {
	$("#kms-totaux").html(distance.toString());
	$("#itis-totaux").html(users.toString());
}

function refreshStatistics() {
	var html = "<h6>Répartition des distances de vos Itinérennes</h6>";
	var total = 0;
	for (i in TRANSPORT_TYPES) {
		html += "<p><strong class='clr-" + TRANSPORT_TYPES[i] + "'>" + TRANSPORT_TYPES_TITLES[TRANSPORT_TYPES[i]] + ":</strong> ";
		html += (itinerennes_manager.statistics_distance[TRANSPORT_TYPES[i]] / 1000).toFixed(2) + "km</p>";
		total += (itinerennes_manager.statistics_distance[TRANSPORT_TYPES[i]] / 1000);
	}

	if (total == 0) {
		var html = "<p class='nostat'>Aucune statistique disponible car vous n'avez enregistré aucun Itinérenne.</p>";
	} else {
		html += "<p></p><p><strong>Total :</strong> " + total.toFixed(2) + "km</p>";
		var chd = "chd=t:"; // data,
		var chl = "chl="; // labels|
		var chco = "chco="; // colors|
		for (i in TRANSPORT_TYPES) {
			if (itinerennes_manager.statistics_distance[TRANSPORT_TYPES[i]] != 0) {
				chd += (itinerennes_manager.statistics_distance[TRANSPORT_TYPES[i]] / 1000).toString() + ",";
				chl += TRANSPORT_TYPES[i].capitalize() + "|";
				chco += TRANSPORT_TYPES_COLOR[TRANSPORT_TYPES[i]].replace('#', '') + "|";
			}
		}
		chd = chd.substring(0, chd.length - 1);
		chl = chl.substring(0, chl.length - 1);
		chco = chco.substring(0, chco.length - 1);
		var googlechart_url = "https://chart.googleapis.com/chart?cht=p&chs=400x200&" + chd + "&" + chl + "&" + chco + "&chf=bg,s,FAFAFA";
		html += "<img src='" + googlechart_url + "'/>";
	}
	$('#moncompte #user-stats + .contenu').html(html);
}

/*******************************************************************************
 * Filtre VeloStar
 ******************************************************************************/
 
 
$('#filtres input#velostar').click(function() {
	if ($('#filtres input#velostar:checked').val() != undefined) {
		itinerennes_manager.showStations(this.id);
	} else {
		itinerennes_manager.hideStations(this.id);
	}

});
/*******************************************************************************
 * Filtre VeloStar
 ******************************************************************************/
var metro_polyline = null;
$('#filtres input#metro').click(function() {
	if ($('#filtres input#metro:checked').val() != undefined) {
		for (i in itinerennes_manager.stations[this.id]) {
			itinerennes_manager.stations[this.id][i].showMarker();
		}
		if (metro_polyline == null) {
			metro_polyline = new google.maps.Polyline();

			var line_options = {
			strokeColor : TRANSPORT_TYPES_COLOR[this.id],
			strokeWeight : 8
			};
			metro_polyline.setOptions(line_options);
			var latlongs = new Array();
			for (i in itinerennes_manager.stations[this.id]) {
				if (itinerennes_manager.stations[this.id][i])
					latlongs.push(new google.maps.LatLng(itinerennes_manager.stations[this.id][i].latitude, itinerennes_manager.stations[this.id][i].longitude));
			}
			metro_polyline.setPath(latlongs);
		}

		metro_polyline.setMap(googlemap);
	} else {
		for (i in itinerennes_manager.stations[this.id])
			itinerennes_manager.stations[this.id][i].hideMarker();
		metro_polyline.setMap(null);
	}
});
/*******************************************************************************
 * Clic sur 'Ajouter une étape'.
 ******************************************************************************/
$('#ajoutetape').click(function() {
	addStepInputField();
});

function addStepInputField() {
	var nb_etapes = $('#trouvez #classique .etape').length;

	if (nb_etapes == MAX_STEPS - 3)
		$('#classique #ajoutetape').fadeOut('fast');

	var html = "<div id='etape" + nb_etapes + "' class='etape'><label for='pos-etape" + nb_etapes + "' class='pos-etape-label'>par</label><div class='clearfix'></div><input type='text' id='pos-etape" + nb_etapes + "' class='pos-etape'></div>";
	if (nb_etapes > 0)
		$(html).insertAfter('#classique #etape' + (nb_etapes - 1));
	else
		$(html).insertAfter('#classique #depart');
}

/*******************************************************************************
 * Clic sur 'Remise �  zéro'.
 ******************************************************************************/
// TODO : Faire un delegate
$('input#reset').each(function() {
	$(this).click(function() {
		resetSearch();
		$(this).removeClass('raz-important');
	});
});
function resetSearch() {
	hideError();

	$('#filtres input:checked').each(function() {
		$(this).click();
	});

	// Reset de la map
	initializeGoogleMap();

	$('.onglets #classique').click();

	// On nettoye les etapes temporaires
	itinerennes_manager.hideSearchPolyline();
	itinerennes_manager.search_steps = new Array();

	for (i in TRANSPORT_TYPES) {
		if (itinerennes_manager.itinerennes[TRANSPORT_TYPES[i]] != null)
			itinerennes_manager.itinerennes[TRANSPORT_TYPES[i]].hide();
	}
	for (i in TRANSPORT_TYPES) {
		if (itinerennes_manager.itinerennes[TRANSPORT_TYPES[i]] != null)
			delete itinerennes_manager.itinerennes[TRANSPORT_TYPES[i]];
	}

	// On vire les resultats.
	$("#resultats").slideUp("fast");
	$("#resultats .contenu").html("");

	// On affiche le bouton 'Ajouter étape'
	$('#ajoutetape').fadeIn('fast');

	// On reactive les input field et on les vide.
	$('#trouvez input:text').each(function() {
		$(this).removeAttr("disabled");
		$(this).attr("value", "");
	});

	// On vire les etapes
	$("#trouvez .etape").each(function() {
		$(this).remove();
	});

	// On montre l'aide
	showHelp('Pour rechercher un itinéraire, cliquez sur la carte pour définir vos étapes ou entrez des adresses dans les champs de recherche �  gauche.');

	activateSearchMode();
}
/*******************************************************************************
 * Clic sur 'Rechercher'.
 ******************************************************************************/
// TODO : voir si plusieurs fonctions ou une seule...
$('#rechercher').click(function() {
	clickRechercher();
	return false;
});
$('#rechercher-mots').click(function() {
	clickRechercherMots($("#trouvez input#mots").val());
	return false;
});

function clickRechercherMots(search_words) {
	hideError();
	desactivateSearchMode();
	itinerennes_manager.searchItinerennesByWords(search_words);
	return false;
}
function clickRechercher() {
	hideError();
	desactivateSearchMode();
	itinerennes_manager.searchItinerennes();
	return false;
}

var current_module_pages = new Array();
var MAX_ITEMS_PER_PAGE = 5;

function addPaginator(search_type) {
	var pager_html = "";

	if (current_module_pages[search_type] == undefined) {
		current_module_pages[search_type] = 1;
	}
	var current_page = current_module_pages[search_type];

	pager_html += "<div class='paginator'>";
	pager_html += "<p class='current-page'>Page " + current_page.toString() + "</p><div class='paginator-links'>";
	if (current_page != 1)
		pager_html += "<a href='#' class='previouspage'>« Page précédente</a>";
	if (itinerennes_manager.itinerennes_types[search_type].length > MAX_ITEMS_PER_PAGE)
		pager_html += "<a href='#' class='nextpage'>Page suivante »</a>";
	pager_html += "</div></div><div class='clearfix'></div>";

	var id = itinerennes_manager.modules_divs[search_type];

	$('.module').undelegate(id + " .contenu .paginator a.previouspage", "click");
	$('.module').undelegate(id + " .contenu .paginator a.nextpage", "click");

	$(id + " .contenu .paginator").remove();
	$(id + " .contenu").append(pager_html);

	var search_mode = search_type;
	$('.module').delegate(id + " .contenu .paginator a.previouspage", "click", function() {
		var curpage = current_module_pages[search_mode];
		current_module_pages[search_mode] = curpage - 1;
		getItinerennes(search_mode);
		return false;
	});
	$('.module').delegate(id + " .contenu .paginator a.nextpage", "click", function() {
		var curpage = current_module_pages[search_mode];
		current_module_pages[search_mode] = curpage + 1;
		getItinerennes(search_mode);
		return false;
	});

}

function refreshItinerennes(search_type) {
	for (i in itinerennes_manager.itinerennes_types[search_type].slice(0, MAX_ITEMS_PER_PAGE))
		if (itinerennes_manager.itinerennes[itinerennes_manager.itinerennes_types[search_type][i]] != null) {
			if (!itinerennes_manager.itinerennes[itinerennes_manager.itinerennes_types[search_type][i]].is_calculated) {
				setTimeout(function() {
					refreshItinerennes(search_type);
				}, 200);
				return;
			}
		} else {
			setTimeout(function() {
				refreshItinerennes(search_type);
			}, 200);
			return;
		}

	var html = "";
	if (search_type == "search") {
		for (i in itinerennes_manager.itinerennes_types[search_type]) {
			html += itinerennes_manager.itinerennes[itinerennes_manager.itinerennes_types[search_type][i]].getHTML();
		}
	} else {
		for (i in itinerennes_manager.itinerennes_types[search_type].slice(0, MAX_ITEMS_PER_PAGE)) {
			html += itinerennes_manager.itinerennes[itinerennes_manager.itinerennes_types[search_type][i]].getHTML();
		}
	}
	var id = itinerennes_manager.modules_divs[search_type];
	var contenu = id.concat('.contenu').toString();

	if (itinerennes_manager.itinerennes_types[search_type].length != 0) {
		$(contenu).html(html);
		if (search_type != "search") {
			addPaginator(search_type);
			for (i in itinerennes_manager.itinerennes_types[search_type].slice(0, MAX_ITEMS_PER_PAGE)) {
				itinerennes_manager.itinerennes[itinerennes_manager.itinerennes_types[search_type][i]].createUploader();
			}
		}
	} else
		$(contenu).html("<div class='aucun'><p>Aucun résultat.</p></div>");

	id = id.replace("> ", "");
	id = id.replace("+ ", "");
	if ((search_type == "search") || (search_type == "words") || (search_type == "tags")) {
		// if (search_type == "search") {
		// $(id + ' .iti-box.pieton .oeil').click();
		// }
		$(id).show();
		$('#resultats').css('height','auto');
	} else if (search_type == "id") {
		$(id + ' .iti-box').addClass("ouvert");
		$(id).slideDown(500, function() {
			scrollUpdate();
		});
	} else if (search_type != "favorites") {
		if ($(id).hasClass("ferme"))
			$(id).click();
		scrollUpdate();
	} else {
		scrollUpdate();
	}

}
/*******************************************************************************
 * Changement de champ de recherche depart/etape/arrivee.
 ******************************************************************************/
// Recherche adresse Google.
$('#trouvez #classique').delegate("input:text", "blur", function() {
	if ($(this).val() != "") {
		desactivateSearchMode();
		var address = $(this).val() + ", 35000, Ille et Vilaine, France";
		getGoogleMapLatLng(address, this);
	}
	return false;
});
/*******************************************************************************
 * ****************************************************************************
 * Erreurs : Gestion de l'affichage de la <div>.
 * ****************************************************************************
 ******************************************************************************/
// Afficher une erreur.
function showError(msg, sel) {
	hideError();
	$("<div class='erreur'>" + msg + "</div>").insertAfter(sel);
}
// Cacher la <div> d'erreur.
function hideError() {
	$('.erreur').remove();
}

/*******************************************************************************
 * ****************************************************************************
 * GoogleMap : Gestion des clics sur la carte
 * ****************************************************************************
 ******************************************************************************/
// Clic sur la carte ne mode recherche
var event_listener;
function activateSearchMode() {
	event_listener = google.maps.event.addListener(googlemap, 'click', function(event) {
		var etape = itinerennes_manager.addSearchStep(event.latLng.lat(), event.latLng.lng());
		if (etape)
			etape.initAddress(setAddressField);
		if (!$('#trouvez #classique.onglet').hasClass('actif')) {
			$('#trouvez #classique.onglet').click();
		}
		$('input#reset').addClass('raz-important');
	});
}
function desactivateSearchMode() {
	google.maps.event.removeListener(event_listener);
}

// Evenement clic sur la Google Map.
function initializeMapClick() {
	activateSearchMode();
}
google.maps.event.addDomListener(window, 'load', initializeMapClick);

// Callback de l'appel au géocodage GoogleMap : on récupère l'adresse par
// rapport au lat/long envoyés.
function setAddressField(google_data) {
	var street_number = google_data.address_components[0].long_name;
	var route = google_data.address_components[1].long_name;
	var city = google_data.address_components[2].long_name;
	var clean_address = street_number + ' ' + route;
	itinerennes_manager.search_steps[itinerennes_manager.search_steps.length - 1].setAddress(clean_address);
	refreshAddressSearchFields();
}
// Rafraichit les <input> et les icones par rapport aux étapes sélectionnées
function refreshAddressSearchFields() {
	var count = 0;
	for (i in itinerennes_manager.search_steps)
		if (itinerennes_manager.search_steps[i])
			count += 1;

	var j = 0;
	for (i in itinerennes_manager.search_steps) {
		if (count > 2)
			if (($('#trouvez #classique input:text').length) != count)
				addStepInputField();
		if (itinerennes_manager.search_steps[i])
			$('#trouvez #classique input:text')[j].value = itinerennes_manager.search_steps[i].getAddress();
		j++;
	}
	$('#trouvez #classique input:text').each(function() {
		$(this).attr("disabled", "disabled");

	});
}