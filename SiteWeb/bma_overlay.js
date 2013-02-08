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