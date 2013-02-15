function ItinerennesOverlay(etape, gmap) {
	this.etape = etape;
	this.div_ = null;
	this.map_ = gmap;
}
ItinerennesOverlay.prototype = new google.maps.OverlayView();

ItinerennesOverlay.prototype.onAdd = function() {
	// Create the DIV and set some basic attributes.
	var div = document.createElement('DIV');
	if (this.etape.itinerenne == null) {
		div.className = "tooltip " + this.etape.type;
	}
	if (this.etape.itinerenne != null) {
		div.className = "tooltip " + this.etape.type + " " + this.etape.itinerenne.getId();
	}
	div.id = 'tooltip' + this.etape.getId();
	div.style.position = "absolute";

	// We add an overlay to a map via one of the map's panes.
	// We'll add this overlay to the overlayImage pane.
	var panes = this.getPanes();
	panes.floatPane.appendChild(div);

	// Set the overlay's div_ property to this DIV
	this.div_ = div;
};
ItinerennesOverlay.prototype.setEtape = function(etape) {
	this.etape = etape;
};
ItinerennesOverlay.prototype.draw = function() {
	var overlayProjection = this.getProjection();
	var pixel_etape = overlayProjection.fromLatLngToDivPixel(this.etape.latlng);

	// Create a new DIV element and attach it to the DIV.
	var contenu = "";

	var fresh_etape = this.etape;
	if (this.etape.itinerenne != null) {
		var fresh_etape = itinerennes_manager.itinerennes[this.etape.itinerenne.id_].etapes[this.etape.order];
		contenu += "<div class='ordre'>" + (parseInt(fresh_etape.order) + 1).toString() + "</div>";
	}
	if (this.etape.type != "user") {
		contenu += "<img class='tooltip-img' src='/media/images/tooltip-" + this.etape.type + ".png'/>";
	}
	var address = this.etape.getAddress();
	if (this.etape.isFirst() && this.etape.isLast()) {
		address = "Départ : " + address;
	} else {
		if (this.etape.isFirst()) {
			address = "Départ : " + address;
		}
		if (this.etape.isLast()) {
			address = "Arrivée : " + address;
		}
	}
	contenu += "<div class='compact'><h6><span class='clr-" + this.etape.type + "'>" + address + "</span></h6></div><div class='clearfix'></div>";
	if (this.etape.type == "velostar") {
		var fresh_etape = null;
		for (i in itinerennes_manager.stations[this.etape.type]) {
			if (itinerennes_manager.stations[this.etape.type][i].id_ == this.etape.id_) {
				fresh_etape = itinerennes_manager.stations[this.etape.type][i];
				break;
			}
		}

		if (fresh_etape.state == true) {
			contenu += "<div class='infos'><p class='dispo'><strong>" + fresh_etape.bikes_available + "</strong> vélos libres et <strong>" + fresh_etape.slots_available + "</strong> places libres</p>";
			contenu += "<p class='meta'>Dernière mise �  jour le " + fresh_etape.getLastUpdate() + "</p>";
			if (fresh_etape.pos == true) {
				contenu += "<div class='vente'></div>";
			}
			contenu += "</div>";
		} else {
			contenu += "<div class='infos'><div class='etat'>Cet borne Vélostar est momentanément indisponible.</div></div>";
		}
	}
	$('#tooltip' + this.etape.getId()).html(contenu);
	$('#tooltip' + this.etape.getId()).css('z-index', function(index) {
		return 1000 * (fresh_etape.order);
	});

	// Resize the image's DIV to fit the indicated dimensions.
	var div = this.div_;
	var width = parseInt($('#tooltip' + this.etape.getId()).css('width').replace('px', '')) / 2;
	var height = parseInt($('#tooltip' + this.etape.getId()).height());
	$(div).css('left', (pixel_etape.x - width - 20) + 'px');
	$(div).css('top', (pixel_etape.y - height - 30) + 'px');
};
ItinerennesOverlay.prototype.onRemove = function() {
	this.div_.parentNode.removeChild(this.div_);
	this.div_ = null;
};
// Note that the visibility property must be a string enclosed in quotes
ItinerennesOverlay.prototype.hide = function() {
	if (this.div_) {
		this.div_.style.visibility = "hidden";
	}
};

ItinerennesOverlay.prototype.show = function() {
	if (this.div_) {
		this.div_.style.visibility = "visible";
	}
};

ItinerennesOverlay.prototype.toggle = function() {
	if (this.div_) {
		if (this.div_.style.visibility == "hidden") {
			this.show();
		} else {
			this.hide();
		}
	}
};
ItinerennesOverlay.prototype.toggleDOM = function() {
	if (this.getMap()) {
		this.setMap(null);
	} else {
		this.setMap(this.map_);
	}
};