/* *****************************************************************************
 *                                   Constantes
 ***************************************************************************** */
// Nombre d'étapes maxi par défault
var MAX_STEPS = 5;
// Epaisseur trait polyline Google Map par défaut
var DEFAULT_STROKE_WEIGHT = 5;
// Types de transports (PIETON, VELO, VELOSTAR, BUS, METRO)
var TRANSPORT_TYPES = [ "pieton", "velo", "velostar", "metro" ];
// Titres des types de transport.
var TRANSPORT_TYPES_TITLES = new Array();
TRANSPORT_TYPES_TITLES["pieton"] = "A pied";
TRANSPORT_TYPES_TITLES["velo"] = "En vélo";
TRANSPORT_TYPES_TITLES["velostar"] = "En VéloSTAR";
TRANSPORT_TYPES_TITLES["bus"] = "En bus";
TRANSPORT_TYPES_TITLES["metro"] = "En métro";

// Types de directions de transport Google (WALKING, DRIVING...)
var TRANSPORT_TYPES_TRAVELMODE = new Array();
TRANSPORT_TYPES_TRAVELMODE["pieton"] = google.maps.DirectionsTravelMode.WALKING;
TRANSPORT_TYPES_TRAVELMODE["velo"] = google.maps.DirectionsTravelMode.DRIVING;
TRANSPORT_TYPES_TRAVELMODE["velostar"] = google.maps.DirectionsTravelMode.DRIVING;
TRANSPORT_TYPES_TRAVELMODE["bus"] = google.maps.DirectionsTravelMode.DRIVING;
TRANSPORT_TYPES_TRAVELMODE["metro"] = google.maps.DirectionsTravelMode.DRIVING;

// Couleurs par défaut par type de transport.
var TRANSPORT_TYPES_COLOR = new Array();
TRANSPORT_TYPES_COLOR["pieton"] = "#FFB20D";
TRANSPORT_TYPES_COLOR["velo"] = "#1780E9";
TRANSPORT_TYPES_COLOR["velostar"] = "#2CB34A";
TRANSPORT_TYPES_COLOR["bus"] = "#FFB20D";
TRANSPORT_TYPES_COLOR["metro"] = "#EF4A43";

/*******************************************************************************
 * ****************************************************************************
 * ItinerennesManager
 * ****************************************************************************
 ******************************************************************************/
function ItinerennesManager() {


	// Types modules
	this.modules_divs = new Array();
	this.modules_divs["id"] = new String("#resultats ");
	this.modules_divs["search"] = new String("#resultats ");
	this.modules_divs["words"] = new String("#resultats ");

	// Stations (velostar, bus...)
	this.stations = new Array();

	// Etapes recherchées
	this.search_steps = new Array(5);

	// Itinerennes
	this.itinerennes = new Array();
	this.itinerennes_types = new Array();
	this.statistics_distance = new Array();

	// Google Map Polyline
	this.search_markers = new Array();
	this.search_polyline = null;

	/*
	 * Initialisation/refresh du manager
	 */
	this.initialize = function() {
		itinerennes_manager.stations["velostar"] = new Array();
		itinerennes_manager.stations["metro"] = new Array();

		this.itinerennes_types["search"] = new Array();
		this.itinerennes_types["id"] = new Array();
		this.itinerennes_types["words"] = new Array();
		this.refreshGlobalStatistics();

		this.initializeMetroStations();
		this.initializeVelostarStations();

		for (i in TRANSPORT_TYPES)
			this.statistics_distance[TRANSPORT_TYPES[i]] = 0;

		var id = get_url_parameter("itinerenne_id");
		if (id)
			getItinerennes("id", id);

		if (current_user_id) {
			this.refreshPrivatesItinerennes();
			this.refreshBestItinerennes();
			this.refreshLastItinerennes();
			this.refreshFavoritesItinerennes();
			this.refreshUserStatistics();
		} else {
			this.refreshBestItinerennes();
			this.refreshLastItinerennes();
		}
	};
	this.getEtape = function(id_etape) {
		for (i in this.itinerennes) {
			var itinerenne = this.itinerennes[i];
			for (j in itinerenne.etapes) {
				var etape = itinerenne.etapes[j];
				if (etape.getId().toString() == id_etape) {
					return etape;
				}
			}
		}
		return null;
	};
	this.initializeVelostarStations = function() {
		initStations("velostar");
	};
	this.initializeMetroStations = function() {
		initStations("metro");
	};
	this.refreshUserStatistics = function() {
		getUserStatistics(refreshStatistics);
	};
	this.refreshGlobalStatistics = function() {
		getGlobalStatistics(refreshGlobalStatistics);
	};
	
	this.showStations = function(type) {
		var polyline_etapes = new Array();
		for (i in this.stations[type]) {
			this.stations[type][i].showMarker();
			if (this.stations[type][i].order != -1) {
				polyline_etapes.push(this.stations[type][i]);
			}
		}
	};
	this.hideStations = function(type) {
		for (i in this.stations[type])
			this.stations[type][i].hideMarker();
	};
	// Zoom sur l'Itinerenne
	this.zoomTo = function() {
		var latlngbounds = new google.maps.LatLngBounds();
		for (i in this.search_steps)
			if (this.search_steps[i])
				latlngbounds.extend(this.search_steps[i].latlng);
		googlemap.fitBounds(latlngbounds);
	};
	/*
	 * Calculer un itinérennes par départ/arrivée
	 */
	this.searchItinerennes = function() {
		this.itinerennes_types["search"] = new Array();
		if (this.search_steps.length <= 1) {
			showError("Il faut au moins deux positions pour calculer un Itinérenne !", '#trouvez');
			return false;
		}
		for (i in TRANSPORT_TYPES) {
			var itinerenne = new Itinerennes(TRANSPORT_TYPES[i], TRANSPORT_TYPES[i], "tempo");
			for (j in this.search_steps) {
				if (this.search_steps[j]) {
					var etape = new Etape(this.search_steps[j].latitude, this.search_steps[j].longitude, itinerenne);
					etape.address = this.search_steps[j].getAddress();
					etape.type = "user";
					itinerenne.etapes.push(etape);
				}
			}
			this.itinerennes_types["search"].push(itinerenne.id_);
			this.itinerennes[TRANSPORT_TYPES[i]] = itinerenne;
			itinerenne.calculate();
		}
		// this.hideSearchPolyline();
		for (i in itinerennes_manager.itinerennes)
			if (itinerennes_manager.itinerennes[i] != null)
				itinerennes_manager.itinerennes[i].hide();

		refreshItinerennes("search");
	};
	this.searchItinerennesByWords = function(words) {
		getItinerennes("words", words);
	};
	/*
	 * Ajout d'une étape
	 */
	this.addSearchStep = function(latitude, longitude) {
		var count = 0;
		for (i in this.search_steps)
			if (this.search_steps[i])
				count += 1;

		if (count == MAX_STEPS) {
			return null;
		}
		var etape = new Etape(latitude, longitude, null);
		etape.type = "user";
		this.search_steps.push(etape);

		var idx = 0;
		for (i in this.search_steps) {
			this.search_steps[i].order = idx;
			idx++;
			this.search_steps[i].refreshIcon();
		}
		this.showSearchPolyline();
		return this.search_steps[this.search_steps.length - 1];
	};
	this.getSearchPolyline = function() {
		if (this.search_polyline == null) {
			this.search_polyline = new google.maps.Polyline();

			var line_options = {
			strokeColor : "#505050",
			strokeWeight : DEFAULT_STROKE_WEIGHT
			};
			this.search_polyline.setOptions(line_options);
		}

		var latlongs = new Array();
		for (i in this.search_steps)
			if (this.search_steps[i])
				latlongs.push(new google.maps.LatLng(this.search_steps[i].latitude, this.search_steps[i].longitude));
		this.search_polyline.setPath(latlongs);
		return this.search_polyline;
	};
	this.showSearchPolyline = function() {
		for (i in this.search_steps)
			if (this.search_steps[i])
				this.search_steps[i].showMarker();
		this.getSearchPolyline().setMap(googlemap);
	};
	this.hideSearchPolyline = function() {
		for (i in this.search_steps)
			if (this.search_steps[i])
				this.search_steps[i].hideMarker();
		if (this.search_polyline != null)
			this.getSearchPolyline().setMap(null);
	};

}
/*******************************************************************************
 * ****************************************************************************
 * Itinerennes
 * ****************************************************************************
 ******************************************************************************/
function Itinerennes(id, transport_type, state) {
	this.id_ = id;
	this.transport_type = transport_type;
	this.etapes = new Array();
	this.state = state;
	this.titre = TRANSPORT_TYPES_TITLES[transport_type];
	this.distance = 0;
	this.photo_url = null;
	this.thumbnail_url = null;
	this.description = "";
	this.instructions = [];
	this.is_visible = false;
	this.is_calculating = false;
	this.is_calculated = false;

	// Google Map objects
	this.directions_display = new Array();
	this.polylines = new Array();

	this.getId = function() {
		return this.id_;
	};
	this.initializeFromResponse = function(response) {
		this.id_ = response.pk;
		this.titre = response.fields.titre.toString();
		this.transport_type = response.fields.transport_type;
		this.state = response.fields.state.toLowerCase();
		
		this.description = response.fields.description;
	
		if (response.fields.photo != "") {
			this.photo_url = "/media/" + response.fields.photo;
			this.thumbnail_url = this.photo_url.replace('user_images', 'user_images/user_images_thumbnails').replace('.jpg', '.thumbnail.jpg');
		} else {
			this.photo_url = "";
			this.thumbnail_url = "";
		}
		this.tags = new Array();
		this.comments = new Array();
		getTags(this);
		getAuthor(this.auteur_id, this);
		getComments(this);
	};
	this.initialize = function() {
		getItinerennesEtapes(this);
	};
	// Enregistrer un resultat de recherche en prive
	this.savePrivate = function() {
		this.state = "user";
		this.save();
	};
	this.save = function() {
		save_itinerenne(this);
	};
	this.publish = function() {
		this.state = "public";
		this.save();
	};
	this.deleteDB = function() {
		this.hide();
		delete_itinerenne(this);
	};
	this.like = function() {
		likeItinerenne(this);
	};
	this.switchFavoriser = function() {
		switchFavorite(this);
	};
	this.updateFromHTML = function() {
		this.titre = $('#' + this.id_ + " .nom").text();
		this.description = $('#' + this.id_ + " .desc").text();
		$('#' + this.id_ + " .poi.user").each(function() {
			var step_id = $(this).attr('id').substring(1);
			var step = itinerennes_manager.getEtape(step_id);
			step.setAddress($(this).text());
		});
		save_itinerenne(this);
	};
	// Zoom sur l'Itinerenne
	this.zoomTo = function() {
		var latlngbounds = new google.maps.LatLngBounds();
		for (i in this.etapes)
			latlngbounds.extend(this.etapes[i].latlng);

		googlemap.fitBounds(latlngbounds);
	};
	this.updateOnSidebar = function() {
		var iti = this;
		$('#' + this.id_ + '.iti-box.' + this.transport_type + "." + this.state).each(function() {
			$(this).hide();
			$(iti.getHTML()).insertBefore($(this));
			$(this).remove();
		});
	};
	this.getAbsoluteURL = function() {
		return getBaseURL() + "?itinerenne_id=" + this.id_;
	};
	// HTML de l'Itinérennes
	this.getHTML = function() {
		// div iti-box
		var html = "<div class='iti-box " + this.transport_type + " " + this.state + "' id='" + this.getId() + "'>";
		// Titre
		html += "<h5 class='titre'><strong><a class='nom'>" + this.titre + "</a>";
		html += "<span class='distance'> " + this.distance + "m.</span> ";
		if (this.tags.length == 0) {
			html += "<span class='tags'>Aucun tag</span></strong>";
		} else {
			html += "<span class='tags'>";
			for (i in this.tags) {
				html += "<a href='#' onclick=\"clickRechercherTags('" + this.tags[i] + "');return false;\">" + this.tags[i] + "</a>";
				if (i != this.tags.length - 1)
					html += ", ";
			}
			html += "</span></strong>";
		}
		// Actions
		var hasvoted = "";
		var votetxt = "Apprécier";
		if ($.inArray(current_user_id, this.likes) != -1) {
			hasvoted = " hasvoted";
			votetxt = "Vous avez apprécié!";
		}
		html += "<div class='actions'><div class='vote" + hasvoted + "'><a href='#'>" + this.likes.length + " <span>" + votetxt + "</a></span></div>";

		if (current_user_id && (this.state == "tempo")) {
			html += "<div class='enregistrer'><a href='#'>&nbsp;<span>Enregistrer</a></span></div>";
		}
		if (current_user_id && (this.state != "tempo") && (this.state != "user") && (this.auteur_id != current_user_id)) {
			var isfavorite = "";
			var favtxt = "Mettre en favori";
			if ($.inArray(current_user_id, this.favorites) != -1) {
				isfavorite = " hasfav";
				favtxt = "Oter des favoris";
			}
			html += "<div class='favoriser" + isfavorite + "'><a href='#'>&nbsp;<span>" + favtxt + "</a></span></div>";
		}

		html += "<div class='partagesocial'>&nbsp;<a href='#'><span>Partager</a></span></div>";
		html += "<div class='imprimable'>&nbsp;<a href='#'><span>Imprimer</a></span></div>";

		if (current_user_id == this.auteur_id) {
			html += "<div class='editer'>&nbsp;<a href='#'><span>Editer</a></span></div>";
			html += "<div class='annuler'>&nbsp;<a href='#'><span>Annuler</a></span></div>";
			html += "<div class='valider'>&nbsp;<a href='#'><span>Valider</a></span></div>";
			html += "<div class='supprimer'>&nbsp;<a href='#'><span>Supprimer</a></span></div>";
		}
		if (this.state == "user")
			html += "<div class='publier'>&nbsp;<a href='#'><span>Publier</a></span></div>";

		html += "<div class='oeil'></div></div><div class='clearfix'></div></h5><div class='contenu'>";

		// Contenu
		if (this.state != "tempo") {

			// Photo
			if (this.thumbnail_url != "")
				html += "<a href='" + this.photo_url + "' class='photo-zoom'><img class='photo' src='" + this.thumbnail_url + "' title='" + this.titre + "' alt='" + this.titre + "' /></a><div id='fileupload-" + this.id_ + "'></div>";
			else
				html += "<div id='fileupload-" + this.id_ + "'></div>";
			// Description
			html += "<p class='desc'>" + this.description + "</p><div class='clearfix'></div>";

			// Auteur, dates
			html += "<p class='auteur'>Créé par " + this.auteur + " le " + this.date_creation + ".";
			if (this.date_modification != this.date_creation)
				html += " Modifié le " + this.date_modification + ".";
			if (this.date_publication != null)
				html += " Publié le " + this.date_publication + ".";
			html += "</p><div class='clearfix'></div>";
		}

		// Onglets
		html += "<div class='onglets'><a href='#' class='onglet iti actif'>Instructions</a>";

		// Onglet Commentaires
		var comment = "commentaire";
		if (this.commentaires.length == 0)
			comment = "<a class='onglet com'>Aucun " + comment + "</a>";
		else if (this.state == "tempo")
			comment = "<a class='onglet com'>Commentaire impossible</a>";
		else if (this.commentaires.length > 1)
			comment = "<a href='#' class='onglet com'>" + this.commentaires.length + " " + comment + "s</a>";
		else
			comment = "<a href='#' class='onglet com'>" + this.commentaires.length + " " + comment + "</a>";
		html += comment;

		html += "</div><div class='clearfix'></div>";

		// Itineraire
		html += "<ol class='itineraire'>";
		var instructions = this.getDirectionsHTML();
		for (i in instructions) {
			html += instructions[i]; // Ajoute les <li> pour les instructions
		}
		html += "</ol>";

		// Commentaires
		if (this.commentaires.length == 0 && this.state == "public" && !current_user_id) {
			html += "<ol class='commentaires'><li>Pas de commentaire. Soyez le premier �  déposer un commentaire!</li><li class='auteur gauche'>Aide Itinérennes</li></ol>";
		}
		if (this.commentaires.length > 0) {
			html += "<ol class='commentaires'>";
			for (i in this.commentaires) {
				html += "<li>" + this.commentaires[i].comment + "</li>";
				// PAIR ET IMPAIR DES AUTEURS OU TROUVER LE SELECTEUR PAIR
				// CSS
				if (i % 2 == 0) {
					html += "<li class='auteur gauche";
				} else {
					html += "<li class='auteur droite";
				}
				html += "'>" + this.commentaires[i].author + ", le " + this.commentaires[i].getCommentDate() + "</li><div class='clearfix'></div>";
			}
		}
		html += "</ol><div class='clearfix'></div>";
		// FORMULAIRE D'AJOUT DE COMMENTAIRE
		if (current_user_id && this.state == "public") {
			html += "<form class='ajout-commentaire'><textarea rows='10' cols='30'>Partagez votre avis ici...</textarea><input type='submit' class='envoi-commentaire bouton petit' value='Laisser le commentaire' /></form>";
		}
		html += "</div>";
		html += "</div>";

		return html;
	};
	this.createUploader = function() {
		var iti = this;
		if (this.auteur_id == current_user_id)
			$(".module").delegate('.iti-box .editer', "click", function() {
				this.uploader = new qq.FileUploader({
				multiple : false,
				action : '/upload_picture/',
				element : $('#fileupload-' + iti.id_)[0],
				allowedExtensions : [ 'jpg', 'jpeg', 'png', 'gif' ],
				params : {
					id : iti.id_
				},
				onComplete : function(id, fileName, response) {
					iti.thumbnail_url = encodeURI("/media" + response);
					iti.photo_url = iti.thumbnail_url.replace("/user_images_thumbnails", "").replace(".thumbnail", "");

					$('#' + iti.id_ + " .photo").each(function() {
						$(this).attr("src", encodeURI("/media" + response));
					});
					return false;
				}
				});
			});
	};
	// Affiche les markers des étapes et la ligne de L'Itinérenne
	this.show = function() {
		itinerennes_manager.hideSearchPolyline();
		this.is_visible = true;
		for (i in this.etapes) {
			this.etapes[i].refreshIcon();
			this.etapes[i].showMarker();
			if ((this.transport_type == "pieton") || (this.transport_type == "velo"))
				this.etapes[i].showMarkerInfo();
			else if (this.etapes[i].type != "user")
				this.etapes[i].showMarkerInfo();
		}
		this.showMapDirections();
		this.showPolylines();
		this.zoomTo();
	};
	this.hide = function() {
		this.is_visible = false;
		this.hideMapDirections();
		this.hidePolylines();

		for (i in this.etapes) {
			this.etapes[i].hideMarker();
			this.etapes[i].hideMarkerInfo();
		}
	};
	this.isVisible = function() {
		return this.is_visible;
	};
	// Calcule l'itinérenne
	this.calculate = function() {
		if ((!this.is_calculating) && (!this.is_calculated)) {
			this.is_calculating = true;
			if ((this.transport_type == "pieton") || (this.transport_type == "velo")) {
				this.calculatePietonVelo();
			} else if (this.transport_type == "velostar") {
				this.calculateVelostar();
			} else if (this.transport_type == "bus") {
				this.calculateBus();
			} else if (this.transport_type == "metro") {
				this.calculateMetro();
			}
		}
	};
	// Calcule pour velostar
	this.calculateVelostar = function() {
		// On calcule les stations vélo les plus proches du départ et de
		// l'arrivée et on les ajoute �  l'itinérenne.
		var etapes_finales = new Array();
		for (i in this.etapes) {
			if (i != this.etapes.length - 1)
				etapes_finales.push(this.etapes[i]);

			if ((i == 0) || (i == this.etapes.length - 1)) {
				var nouvelle_etape = getcloseststation(this.transport_type, this.etapes[i].latitude, this.etapes[i].longitude);
				nouvelle_etape.itinerenne = this;
				if (i == 0)
					nouvelle_etape.address = "Emprunter un VeloSTAR �  la station '" + nouvelle_etape.address.capitalize() + "'";
				if (i == this.etapes.length - 1)
					nouvelle_etape.address = "Déposer le VeloSTAR �  la station '" + nouvelle_etape.address.capitalize() + "'";
				nouvelle_etape.type = this.transport_type;
				etapes_finales.push(nouvelle_etape);
			}
			if (i == this.etapes.length - 1)
				etapes_finales.push(this.etapes[i]);
		}
		this.etapes = etapes_finales;
		this.etapes[this.etapes.length - 2].address = this.etapes[this.etapes.length - 2].address;

		for (i in this.etapes)
			this.etapes[i].order = parseInt(i);

		// et après on calcule :
		// entre le depart et la premiere station velostar : a pied
		var etapes_temp = new Array();
		etapes_temp.push(this.etapes[0]);
		etapes_temp.push(this.etapes[1]);
		this.getGoogleMapItineraire(etapes_temp, "pieton", etapes_temp);

		// entre les autres etapes : a velo
		var etapes_temp = new Array();
		for ( var i = 1; i < this.etapes.length - 1; i++) {
			etapes_temp.push(this.etapes[i]);
		}
		this.getGoogleMapItineraire(etapes_temp, "velostar", etapes_temp);

		// entre la derniere station velostar et l'arrivee : a pied
		var etapes_temp = new Array();
		etapes_temp.push(this.etapes[this.etapes.length - 2]);
		etapes_temp.push(this.etapes[this.etapes.length - 1]);
		this.getGoogleMapItineraire(etapes_temp, "pieton", etapes_temp);
	};
	// Calcule pour bus
	this.calculateBus = function(callback) {
		// On calcule les stations bus les plus proches du départ et de
		// l'arrivée et on les ajoute �  l'itinérenne.
		var etapes_finales = new Array();

		for (i in this.etapes) {
			if (i != this.etapes.length - 1)
				etapes_finales.push(this.etapes[i]);
			if ((i == 0) || (i == this.etapes.length - 1)) {
				var nouvelle_etape = getcloseststation(this.transport_type, this.etapes[i].latitude, this.etapes[i].longitude);
				nouvelle_etape.itinerenne = this;
				if (i == 0)
					nouvelle_etape.address = "Prendre le bus �  l'arrêt '" + nouvelle_etape.address.toLowerCase().capitalize() + "'";
				if (i == this.etapes.length - 1)
					nouvelle_etape.address = "Descendre du bus �  l'arrêt '" + nouvelle_etape.address.toLowerCase().capitalize() + "'";
				nouvelle_etape.type = this.transport_type;
				etapes_finales.push(nouvelle_etape);
			}
			if (i == this.etapes.length - 1)
				etapes_finales.push(this.etapes[i]);
		}
		this.etapes = etapes_finales;

		for (i in this.etapes)
			this.etapes[i].order = parseInt(i);

		this.calculatePietonVelo();
	};
	this.calculateMetroEntreDeuxEtapes = function(etapeA, etapeB) {
		var etapes_finales = new Array();

		etapes_finales.push(etapeA);

		var premiere_etape = getcloseststation(this.transport_type, etapeA.latitude, etapeA.longitude);
		premiere_etape.itinerenne = this;
		premiere_etape.address = "Prendre le metro �  la station '" + premiere_etape.address.toLowerCase().capitalize() + "'";
		premiere_etape.type = this.transport_type;

		var deuxieme_etape = getcloseststation(this.transport_type, etapeB.latitude, etapeB.longitude);
		deuxieme_etape.itinerenne = this;
		deuxieme_etape.address = "Descendre du metro �  la station '" + deuxieme_etape.address.toLowerCase().capitalize() + "'";
		deuxieme_etape.type = this.transport_type;

		if (premiere_etape.id_ != deuxieme_etape.id_) {
			premiere_etape.order = etapeA.order + 1;
			deuxieme_etape.order = etapeA.order + 2;
			etapes_finales.push(premiere_etape);
			etapes_finales.push(deuxieme_etape);
			var startPoint = new LatLong(premiere_etape.latitude, premiere_etape.longitude);
			var endPoint = new LatLong(deuxieme_etape.latitude, deuxieme_etape.longitude);
			var dist = LatLong.distHaversine(startPoint, endPoint);
			this.distance += parseInt(dist.toFixed(3) * 1000);
		}

		return etapes_finales;
	};
	this.calculateMetro = function() {
		// On calcule les stations metro les plus proches du départ et de
		// l'arrivée et on les ajoute �  l'itinérenne.
		var etapes = new Array();
		for ( var i = 0; i < this.etapes.length - 1; i++) {
			var etapesT = this.calculateMetroEntreDeuxEtapes(this.etapes[i], this.etapes[i + 1]);
			for (j in etapesT)
				etapes.push(etapesT[j]);
			for ( var k = 0; k < etapes.length; k++) {
				etapes[k].order = parseInt(k);
			}

		}
		// On ajoute la dernière étape
		var derniere_etape = this.etapes[this.etapes.length - 1];
		derniere_etape.order = etapes.length - 1;
		derniere_etape.id = this.transport_type + "_" + derniere_etape.order;
		etapes.push(derniere_etape);

		// On réajuste l'ordre.
		for ( var i = 0; i < etapes.length; i++) {
			etapes[i].order = parseInt(i);
		}

		this.etapes = etapes;

		for ( var i = 0; i < this.etapes.length - 1; i++) {
			var start = this.etapes[i];
			var end = this.etapes[i + 1];
			if (start.type == "user") {
				// Calcul pieton
				var e1 = new Array();
				e1.push(start);
				e1.push(end);
				this.getGoogleMapItineraire(e1, "pieton", e1);
			} else if ((start.type == "metro") && (end.type == "metro")) {
				// Calcul Metro (polyline)
				this.addPolyline(start, end);
			} else {
				// Calcul pieton
				var e3 = new Array();
				e3.push(start);
				e3.push(end);
				this.getGoogleMapItineraire(e3, "pieton", e3);
			}
		}
	};
	this.addPolyline = function(start_etape, end_etape) {

		var tr_start = null;
		var tr_end = null;
		var tr_etape = null;
		for (i in itinerennes_manager.stations[this.transport_type]) {
			tr_etape = itinerennes_manager.stations[this.transport_type][i];
			if ((parseFloat(start_etape.latitude) == parseFloat(tr_etape.latitude)) && (parseFloat(start_etape.longitude) == parseFloat(tr_etape.longitude))) {
				tr_start = tr_etape;
				continue;
			}
			if ((parseFloat(end_etape.latitude) == parseFloat(tr_etape.latitude)) && (parseFloat(end_etape.longitude) == parseFloat(tr_etape.longitude))) {
				tr_end = tr_etape;
				continue;
			}
			if (tr_start && tr_end)
				break;
		}

		if (tr_start.order > tr_end.order) {
			var tr_temp = tr_start;
			tr_start = tr_end;
			tr_end = tr_temp;
		}

		var line_etapes = itinerennes_manager.stations[this.transport_type].slice(tr_start.order, tr_end.order + 1);
		var polyline = new google.maps.Polyline();
		var line_options = {
		strokeColor : this.getPolylineColor(),
		strokeWeight : DEFAULT_STROKE_WEIGHT
		};
		polyline.setOptions(line_options);
		var latlongs = new Array();
		for (i in line_etapes) {
			latlongs.push(new google.maps.LatLng(line_etapes[i].latitude, line_etapes[i].longitude));
		}
		polyline.setPath(latlongs);
		this.polylines.push(polyline);
	};
	this.showPolylines = function() {
		for (i in this.polylines) {
			if (this.polylines[i] != null)
				this.polylines[i].setMap(googlemap);
		}
	};
	this.hidePolylines = function() {
		for (i in this.polylines) {
			if (this.polylines[i] != null)
				this.polylines[i].setMap(null);
		}
	};
	// Calcule pour pieton ou velo par GoogleMap
	this.calculatePietonVelo = function() {
		this.getGoogleMapItineraire(this.etapes, this.transport_type, this.etapes);
	};
	this.getGoogleMapItineraire = function(etapes, transport_type, temp_etapes) {
		var positions_etapes = new Array();
		for ( var i = 1; i < etapes.length - 1; i++)
			positions_etapes.push({
				location : etapes[i].getMarker().getPosition()
			});

		var is_last = false;
		if (etapes[etapes.length - 1].order == this.etapes[this.etapes.length - 1].order)
			is_last = true;

		var request = {
		origin : etapes[0].getMarker().getPosition(),
		destination : etapes[etapes.length - 1].getMarker().getPosition(),
		waypoints : positions_etapes,
		avoidHighways : true,
		avoidTolls : true,
		travelMode : TRANSPORT_TYPES_TRAVELMODE[transport_type],
		provideRouteAlternatives : false
		};

		var itinerenne = this;
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				itinerenne.addDirectionsDisplay(response, transport_type, temp_etapes);
				if (is_last) {
					itinerenne.is_calculating = false;
					itinerenne.is_calculated = true;
					for (i in itinerenne.etapes) {
						itinerenne.etapes[i].order = parseInt(i);
					}
					itinerennes_manager.itinerennes[itinerenne.id_] = itinerenne;
				}
			}
		});
	};
	this.getDirectionsHTML = function() {
		return this.instructions;
	};
	this.addComment = function(commentaire) {
		var comment = new Commentaire(current_username, new Date(), commentaire);
		this.commentaires.push(comment);
		saveComment(this.id_, comment);
	};
	this.addDirectionsHTML = function(response, temp_steps) {
		var found = false;
		for (i in this.instructions) {
			if (this.instructions[i].indexOf(temp_steps[0].address) != -1) {
				found = true;
			}
		}
		if (found == false) {
			var html = "<li id='t" + temp_steps[0].getId() + "' class='poi " + temp_steps[0].type + "'>" + temp_steps[0].getAddress() + "</li>";
			this.instructions.push(html);
		}

		for ( var i = 0; i < response.routes[0].legs.length; ++i) {
			this.distance += response.routes[0].legs[i].distance.value;
			for ( var j = 0; j < response.routes[0].legs[i].steps.length; ++j) {
				html = "<li>" + response.routes[0].legs[i].steps[j].instructions + "</li>";
				this.instructions.push(html);
			}
			if (response.routes[0].legs.length - 1 != i) {
				html = "<li id='t" + temp_steps[i + 1].getId() + "' class='poi " + temp_steps[i + 1].type + "'>" + temp_steps[i + 1].getAddress() + "</li>";
				this.instructions.push(html);
			}
		}

		var found = false;
		for (i in this.instructions) {
			if (this.instructions[i].indexOf(temp_steps[temp_steps.length - 1].address) != -1) {
				found = true;
			}
		}
		if (found == false) {
			html = "<li id='t" + temp_steps[temp_steps.length - 1].getId() + "' class='poi " + temp_steps[temp_steps.length - 1].type + "'>" + temp_steps[temp_steps.length - 1].getAddress() + "</li>";
			this.instructions.push(html);
		}
	};
	this.addDirectionsDisplay = function(response, transport_type, temp_steps) {
		this.addDirectionsHTML(response, temp_steps);

		var google_directions_renderer = new google.maps.DirectionsRenderer({
		suppressMarkers : true,
		suppressInfoWindows : true,
		suppressBicyclingLayer : true,
		preserveViewport : true,
		polylineOptions : {
		strokeColor : TRANSPORT_TYPES_COLOR[transport_type],
		strokeWeight : 6
		}
		});
		google_directions_renderer.setDirections(response);
		this.directions_display.push(google_directions_renderer);
		if (this.is_visible) {
			this.show();
		}
	};
	this.showMapDirections = function() {
		for (i in this.directions_display)
			this.directions_display[i].setMap(googlemap);
	};
	this.hideMapDirections = function() {
		for (i in this.directions_display)
			this.directions_display[i].setMap(null);
	};
	// Polyline Google Map
	this.getPolyline = function() {
		if (this.polyline == null) {
			this.polyline = new google.maps.Polyline();

			var line_options = {
			strokeColor : this.getPolylineColor(),
			strokeWeight : DEFAULT_STROKE_WEIGHT
			};
			this.polyline.setOptions(line_options);
		}

		var latlongs = new Array();
		for (i in this.etapes) {
			latlongs.push(new google.maps.LatLng(this.etapes[i].latitude, this.etapes[i].longitude));
		}
		this.polyline.setPath(latlongs);
		return this.polyline;
	};
	this.showPolyline = function() {
		this.getPolyline().setMap(googlemap);
	};
	this.hidePolyline = function() {
		if (this.polyline != null)
			this.getPolyline().setMap(null);
	};
	this.getPolylineColor = function() {
		if (this.transport_type == "pieton")
			return "#FFB20D";
		else if (this.transport_type == "velo")
			return "#4958FF";
		else if (this.transport_type == "velostar")
			return "#2CB34A";
		else if (this.transport_type == "bus")
			return "#FFB20D";
		else if (this.transport_type == "metro")
			return "#EF554E";

		return "#505050";
	};
}

/*******************************************************************************
 * ****************************************************************************
 * Etape
 * ****************************************************************************
 ******************************************************************************/
function Etape(latitude, longitude, itinerenne) {
	this.id_ = null;
	this.order = null;
	this.itinerenne = itinerenne;
	this.photo_url = "iti-photo.jpg";
	this.type = null; // USER, PIETON, VELO, VELOSTAR, BUS, METRO
	this.address = null;
	this.keolis_name = null;
	this.keolis_id = null;
	this.last_update = null;
	this.latitude = latitude;
	this.longitude = longitude;
	this.pos = null;
	this.state = null;
	this.bikes_available = null;
	this.slots_available = null;

	// Google Maps objects
	this.latlng = null;
	this.marker = null;
	this.overlay = null;

	this.initializeFromResponse = function(response) {
		this.id_ = response.pk;
		this.address = response.name;
		this.keolis_name = response.keolis_name;
		this.keolis_id = response.keolis_id;
		this.last_update = new Date(response.last_update);
		this.type = response.type.toLowerCase();
		if (response.order == null)
			this.order = -1;
		else
			this.order = parseInt(response.order);
		this.pos = (response.point_of_sale == 1);
		this.state = (response.state == 1);
		this.bikes_available = response.bikes_available;
		this.slots_available = response.slots_available;
		this.latitude = response.position.latitude;
		this.longitude = response.position.longitude;
		this.refreshIcon();
	};
	this.getLastUpdate = function() {
		return this.last_update.toLocaleString();
	};
	this.getIconURL = function() {
		return "gmmarker-" + this.type + ".png";
	};
	this.isFirst = function() {
		if (this.type != "user")
			return false;
		if (this.getOrder() == -1)
			return false;
		return (this.getOrder() == 0);
	};
	this.isLast = function() {
		if (this.getOrder() == -1)
			return false;
		if (this.itinerenne == null) {
			var nb_notnull = 0;
			for (i in itinerennes_manager.search_steps) {
				if (itinerennes_manager.search_steps[i] != null)
					nb_notnull++;
			}
			return (this.getOrder() == (nb_notnull - 1));
		}
		return (this.getOrder() == (this.itinerenne.etapes.length - 1));
	};
	this.getId = function() {
		if (this.id_ == null)
			if (this.itinerenne == null)
				this.id_ = this.type + "_" + this.getOrder().toString();
			else
				this.id_ = this.itinerenne.getId().toString() + "_" + this.getOrder().toString();
		return this.id_;
	};
	this.getOrder = function() {
		if (this.order == null) {
			if (this.itinerenne == null) {
				var idx = -1;
				for (i in itinerennes_manager.search_steps) {
					idx++;
					if (itinerennes_manager.search_steps[i])
						if (itinerennes_manager.search_steps[i].latitude == this.latitude && itinerennes_manager.search_steps[i].longitude == this.longitude)
							if (itinerennes_manager.search_steps[i].type == this.type) {
								this.order = idx;
								return parseInt(this.order);
							}
				}
			} else {
				for (i in this.itinerenne.etapes)
					if (this.itinerenne.etapes[i].latitude == this.latitude && this.itinerenne.etapes[i].longitude == this.longitude)
						if (this.itinerenne.etapes[i].type == this.type)
							this.order = i;
			}
		}
		return parseInt(this.order);
	};
	// Google LatLng
	this.getPosition = function() {
		if (this.latlng == null)
			this.latlng = new google.maps.LatLng(this.latitude, this.longitude);
		return this.latlng;
	};
	this.getInfoWindow = function() {
		if (this.overlay == null)
			this.overlay = new ItinerennesOverlay(this, googlemap);
		return this.overlay;
	};
	this.refreshIcon = function() {
		var myMarkerImage = null;
		if (this.isFirst())
			myMarkerImage = new google.maps.MarkerImage("gmmarker-depart.png", new google.maps.Size(74, 45), new google.maps.Point(0, 0), new google.maps.Point(37, 10));
		else if (this.isLast())
			myMarkerImage = new google.maps.MarkerImage("gmmarker-arrivee.png", new google.maps.Size(74, 45), new google.maps.Point(0, 0), new google.maps.Point(37, 10));
		else
			myMarkerImage = new google.maps.MarkerImage(this.getIconURL(), new google.maps.Size(18, 18), new google.maps.Point(0, 0), new google.maps.Point(0, 9));
		this.getMarker().setIcon(myMarkerImage);
	};
	// Marker Google Map
	this.getMarker = function() {
		if (this.marker == null) {
			this.marker = new google.maps.Marker();
			this.marker.setPosition(this.getPosition());
			this.marker.setTitle(this.getAddress());
			var etape = this;
			var infowindow = this.getInfoWindow();
			// google.maps.event.addListener(this.marker, 'click', function(evt)
			// {
			// if (etape.getInfoWindow().getMap()) {
			// etape.hideMarkerInfo();
			// } else {
			// etape.showMarkerInfo();
			// }
			// });
			google.maps.event.addListener(this.marker, 'mouseover', function(evt) {
				etape.showMarkerInfo();
			});
			google.maps.event.addListener(this.marker, 'mouseout', function(evt) {
				etape.hideMarkerInfo();
			});
		}
		return this.marker;
	};
	this.showMarker = function() {
		this.getMarker().setMap(googlemap);
	};
	this.hideMarker = function() {
		this.hideMarkerInfo();
		this.getMarker().setMap(null);
	};
	this.showMarkerInfo = function() {
		this.getInfoWindow().setMap(googlemap);
	};
	this.hideMarkerInfo = function() {
		this.overlay.setMap(null);
	};
	// Adresse
	this.initAddress = function(callback) {
		if (this.address == null) {
			getGoogleMapAddress(this.getPosition(), callback);
		}
	};
	this.getAddress = function() {
		if (this.address == null)
			return "Adresse inconnue";
		return this.address;
	};
	this.setAddress = function(address) {
		this.address = address;
	};
}

$(document).ready(function() {
	var searchtags = "";
	for (i in itinerennes_manager.tags) {
		searchtags += "<label for='" + i + "'><input type='checkbox' id='" + i + "'>" + itinerennes_manager.tags[i] + "</label>";
	}
	// $('#trouvez #tag-check').html(searchtags);
});