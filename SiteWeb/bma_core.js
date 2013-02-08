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