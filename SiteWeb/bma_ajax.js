calendars = new Array();
lines = new Array();

function getBaseURL() {
	var url = location.href; // entire url including querystring - also:
	// window.location.href;

};
function get_url_parameter(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.href);
	if (results == null)
		return "";
	else
		return results[1];
};
String.prototype.capitalize = function() {
	return this.replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
		return p1 + p2.toUpperCase();
	});
};
String.prototype.startsWith = function(str) {
	return (this.match("^" + str) == str);
};
$('.aide').ajaxStart(function() {
	showHelp("load");
});
$('.aide').ajaxStop(function() {
	hideHelp();
	if ($('#resultats').is(":visible") == false) {
		showHelp("Pour rechercher un itinéraire, cliquez sur la carte pour définir vos étapes ou entrez des adresses dans les champs de recherche �  gauche.");
	}
});
function getcloseststation(transport_type, latitude, longitude) {
	var stations = new Array();
	$.ajax({
	async : false,
	url : '/getcloseststation/json/',
	dataType : "json",
	data : {
	"station_type" : transport_type.toUpperCase(),
	"latitude" : latitude,
	"longitude" : longitude
	},
	success : function(response) {
		for (i in response) {
			var etape = new Etape();
			etape.initializeFromResponse(response[i]);
			stations.push(etape);
		}
	}
	});
	return stations[0];
}
var delete_itinerenne = function(itinerenne) {
	$.ajax({
	async : true,
	url : '/delete_itinerenne/',
	dataType : "json",
	type : "POST",
	data : {
		"id" : itinerenne.id_
	},
	success : function(data) {
		getItinerennes("user");
		getItinerennes("best");
		getItinerennes("last");
		getItinerennes("favorites");
		itinerennes_manager.refreshUserStatistics();
		itinerennes_manager.refreshGlobalStatistics();
	}
	});
};
var upload_file = function(id) {
	$.ajax({
	async : true,
	url : '/upload_picture/',
	dataType : "json",
	type : "POST",
	data : {
		"id" : id
	},
	success : function(data) {

	}
	});
};
var save_itinerenne = function(itinerenne, picture_field) {

	var iti_etapes = new Array();
	for (i in itinerenne.etapes) {
		var etape = itinerenne.etapes[i];
		if (etape.type == "user") {
			iti_etapes.push([ etape.id_, etape.order, etape.address, etape.latitude, etape.longitude ].join('||'));
		}
	}
	var data = {
	id : itinerenne.id_,
	titre : itinerenne.titre,
	description : itinerenne.description,
	share_state : itinerenne.state.toUpperCase(),
	distance : itinerenne.distance,
	user_id : current_user_id,
	transport_type : itinerenne.transport_type,
	steps : iti_etapes.join('@@'),
	tags : itinerenne.tags.join('@@'),
	picture : picture_field
	};
	$.ajax({
	type : "POST",
	url : "/save_itinerenne/",
	data : data,
	success : function(response) {
		var itinerenne = new Itinerennes();
		itinerenne.initializeFromResponse(response[0]);
		getItinerennesEtapes(itinerenne);
		itinerennes_manager.itinerennes[itinerenne.id_] = itinerenne;
		getItinerennes("user");
		getItinerennes("best");
		getItinerennes("last");
		getItinerennes("favorites");
		itinerennes_manager.refreshGlobalStatistics();
		itinerennes_manager.refreshUserStatistics();
	}
	});
	return false;
};
var current_module_args = new Array();
function getItinerennes(search_type, args) {
	if (current_module_pages[search_type] == undefined) {
		current_module_pages[search_type] = 1;
	}
	if (current_module_args[search_type] == undefined) {
		current_module_args[search_type] = args;
	}
	var arguments = null;
	if (args != null)
		arguments = args;
	else
		arguments = current_module_args[search_type];

	var max_files = MAX_ITEMS_PER_PAGE + 1;
	var first_file = (current_module_pages[search_type] - 1) * MAX_ITEMS_PER_PAGE;
	itinerennes_manager.itinerennes_types[search_type] = new Array();
	$.ajax({
	async : true,
	url : '/get_itinerennes/',
	dataType : "json",
	type : "POST",
	data : {
	'search_type' : search_type,
	'user_id' : current_user_id,
	'args' : arguments,
	'max_files' : max_files,
	'first_file' : first_file
	},
	success : function(response) {
		var itinerennes = new Array();
		for (i in response) {
			var itinerenne = new Itinerennes();
			itinerenne.initializeFromResponse(response[i]);
			itinerennes[response[i].pk] = itinerenne;
			itinerennes_manager.itinerennes_types[search_type].push(response[i].pk);
		}
		for (i in itinerennes) {
			var found = false;
			for (j in itinerennes_manager.itinerennes)
				if (i == j) {
					found = true;
				}
			if (found == false) {
				itinerennes_manager.itinerennes[i] = null;
				getItinerennesEtapes(itinerennes[i]);

			}
		}
		refreshItinerennes(search_type);
	}
	});
};
function saveComment(itiid, commentaire) {
	$.ajax({
	async : true,
	url : '/save_comment/',
	dataType : "json",
	type : "POST",
	data : {
	"iid" : itiid,
	"comment" : commentaire.comment
	},
	success : function(response) {
		var itinerenne = new Itinerennes();
		itinerenne.initializeFromResponse(response[0]);
		getItinerennesEtapes(itinerenne);
		itinerennes_manager.itinerennes[itinerenne.id_] = itinerenne;
		getItinerennes("user");
		getItinerennes("best");
		getItinerennes("last");
		getItinerennes("favorites");
	}
	});
}
function getItinerennesEtapes(itinerenne) {
	$.ajax({
	async : true,
	url : '/get_itinerennes_etapes/',
	dataType : "json",
	type : "POST",
	data : {
		"id" : itinerenne.id_
	},
	success : function(response) {
		for (i in response) {
			var etape = new Etape();
			etape.initializeFromResponse(response[i]);
			etape.itinerenne = itinerenne;
			itinerenne.etapes.push(etape);
		}
		if (itinerenne != null)
			for (i in itinerenne.etapes)
				itinerenne.etapes[i].order = parseInt(i);

		for (i in itinerenne.etapes)
			if (itinerenne.etapes[i].order == (itinerenne.etapes.length - 1))
				itinerenne.calculate();
	}
	});
}
function getAuthor(authid, iti) {
	$.ajax({
	async : true,
	url : '/get_login_name/',
	dataType : "json",
	type : "POST",
	data : {
		"authid" : authid
	},
	success : function(data) {
		for (i in data)
			iti.auteur = data[i];
	}
	});
}
function getTags(iti) {
	if (iti != null)
		id = iti.id_;
	else
		id = null;
	$.ajax({
	async : true,
	url : '/get_tags/',
	dataType : "json",
	type : "POST",
	data : {
		"iid" : id
	},
	success : function(data) {
		if (iti != null)
			for (i in data)
				iti.tags.push(data[i].fields.value);
		else {
			var html = "";
			for (i in data) {
				tag_word = data[i][0];
				font_size = parseFloat(data[i][1]);
				if (font_size == 0.0)
					font_size = 0.8;
				count = parseFloat(data[i][2]);
				itinerennes_manager.tags.push(tag_word);
				html += " <a href='#' onclick=\"clickRechercherTags('" + tag_word + "');return false;\" style='font-size:" + font_size + "em'>" + tag_word + "</a> ";
			}
			$("#trouvez #tag-check").html(html);
		}
	}
	});
}
function getComments(iti) {
	$.ajax({
	async : true,
	url : '/get_comments/',
	dataType : "json",
	type : "POST",
	data : {
		"iid" : iti.id_
	},
	success : function(data) {
		for (i in data) {
			var commentaire = new Commentaire();
			commentaire.initFromResponse(data[i]);
			iti.commentaires.push(commentaire);
		}
	}
	});
}
function getCommentsAuthor(authid, comm) {
	$.ajax({
	async : true,
	url : '/get_login_name/',
	dataType : "json",
	type : "POST",
	data : {
		"authid" : authid
	},
	success : function(data) {
		comm.author = data;
	}
	});
}
function likeItinerenne(iti) {
	$.ajax({
	async : true,
	url : '/like_itinerenne/',
	dataType : "json",
	type : "POST",
	data : {
		"iid" : iti.id_
	},
	success : function(response) {
		for (i in response) {
			itinerennes_manager.itinerennes[response[i].pk].initializeFromResponse(response[i]);
		}
		getItinerennes("best");
		getItinerennes("last");
		getItinerennes("favorites");
	}
	});
}
function switchFavorite(iti) {
	$.ajax({
	async : true,
	url : '/favorite_itinerenne/',
	dataType : "json",
	type : "POST",
	data : {
		"iid" : iti.id_
	},
	success : function(response) {
		for (i in response) {
			itinerennes_manager.itinerennes[response[i].pk].initializeFromResponse(response[i]);
		}
		getItinerennes("favorites");
		getItinerennes("best");
		getItinerennes("last");
	}
	});
}
function getGlobalStatistics(callback) {
	$.ajax({
	async : true,
	url : '/get_global_statistics/',
	dataType : "json",
	type : "GET",
	success : function(response) {
		callback(Math.round(response.distance / 1000), response.number, response.users);
	}
	});
}
