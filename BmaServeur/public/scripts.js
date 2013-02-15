


// CLIC SUR X POUR FERMER DIV LOADING OU AIDE
$('.aide').delegate('.aide-fermer', 'click', function() {
	hideHelp();
});


// CACHER DIV LOADING OU AIDE
function hideHelp() {
	$('.aide').removeClass('chargement').hide();
}

// CLIC SUR TITRE LEGENDE POUR MONTRER LA LEGENDE
$('#legende-titre').click(function() {
	$(this).next().slideToggle(300);
});




// MOUSEOUT SUR INPUT POI EDITABLE
$('.module').delegate('input.poi-user', 'mouseout', function(event) {
	if (clavier != 1) {
		var id_etape = $(this).next().attr('id').replace('t', '');
		var etape = itinerennes_manager.getEtape(id_etape);
		if (etape)
			etape.hideMarkerInfo();
	} else {
		event.stopImmediatePropagation();
	}
	event.stopImmediatePropagation();
});

$(".module").delegate(".iti-box h5 .newtitre", "click", function() {
	if (valider == 1 || annuler == 1) {
		// TITRE
		var titre = "<a class='nom'>" + $(this).val() + "</a>";
		$(titre).insertBefore($(this));
		$(this).remove();
	}
});

$(".module").delegate(".iti-box h5 .newtags", "click", function() {
	if (valider == 1 || annuler == 1) {
		// TAGS
		var newtags = "<span class='tags'>";

		var tags_array = new Array();
		$('input:checked', $(this)).each(function() {
			newtags += "<a class='" + $(this).attr("id") + "'>" + $(this).parent().text() + "</a>, ";
			tags_array.push($(this).parent().text());
		});
		if (annuler == 0) {
			itinerennes_manager.itinerennes[itiedit].tags = tags_array;
		}
		newtags += "</span>";
		$('#' + itiedit + ' .distance').show();
		$(newtags).insertAfter('#' + itiedit + ' .distance');
		$(this).remove();
		$('#' + itiedit + ' .tags').show();
	}
});

$(".module").delegate(".iti-box textarea.newdesc", "click", function() {
	if (valider == 1 || annuler == 1) {
		// DESC
		$('#' + itiedit + ' p.desc').text($(this).val());
		$(this).hide();
		$('#' + itiedit + ' p.desc').show();
		$(this).remove();
	}
});

$(".module").delegate(".iti-box input.poi-user", "click", function() {
	if (valider == 1 || annuler == 1) {
		// POI USER
		if (annuler == 0) {
			$("#" + $('input.poi-user').next().attr('id')).text($(this).val());
		}
		$(this).hide();
		$("#" + $('input.poi-user').next().attr('id')).show();
		$(this).prev().remove();
		$(this).remove();
	}
});

// ON CACHE LES CONTENUS DES MODULES FERMES (MODULE FERME = H3/H4 .TITRE.FERME)
$('.titre.ferme').each(function() {
	$(this).next().hide();
});

// CLIC SUR LES TITRES H3 (MODULES) ET H4 (SOUS-MODULES)
$(".module").delegate("h4.titre, h3.titre", "click", function() {
	if ($(this).next().is(":visible") == true) {
		$(this).next().slideUp(500, function() {
			scrollUpdate;
		});
		$(this).addClass('ferme');
	} else {
		$(this).next().slideDown(500, function() {
			scrollUpdate;
		});
		$(this).removeClass('ferme');
	}
});

// CLIC SUR LES H5 (TITRE DES ITINERENNES)
// TODO: AJOUTER UN IF SI L'URL POINTE VERS UN ITINERENNE PARTICULIER POUR
// L'OUVRIR PAR DEFAUT
$(".module").delegate("h5.titre strong", "click", function() {
	if ($(this).parent().parent().attr('id') != itiedit) {
		if ($(this).parent().next().is(":visible") == true) {
			$(this).parent().next().slideUp(500, function() {
				$(this).parent().removeClass('ouvert');
				scrollUpdate;
			});
		} else {
			$(this).parent().next().slideDown(500, function() {
				scrollUpdate;
			});
			$(this).parent().parent().addClass('ouvert');
		}
	}
});

// MOUSEOVER SUR LES ICONES D'ACTIONS (TOGGLE TEXTE (SPAN) CORRESPONDANT)
$('.actions div').live('mouseover mouseout', function(event) {
	if ($(this).hasClass('annuler') || $(this).hasClass('valider')) {
		return;
	}
	if (event.type == 'mouseover') {
		$('span', this).show();
	} else {
		$('span', this).hide();
	}
});

$('#favoriser-shortcut').live('mouseover mouseout', function(event) {
	var j = $(this).parent().parent().parent().parent();
	if (event.type == 'mouseover') {
		$('.favoriser span', j).show();
	} else {
		$('.favoriser span', j).hide();
	}
});

// CACHER DIV CONTENU STATIQUE
$('#statique #contenu-statique div').hide();

// CLIC SUR LES MENUS DU FOOTER POUR AFFICHER LA DIV STATIQUE CORRESPONDANTE ET
// SON FOND GRIS OVERLAY
// TODO: TRANSFORMER EN FONCTION SI ROLAND VEUT L'APPELER
$('#footer #menu a').click(function() {
	$('#statique #contenu-statique div').hide();
	var a = $(this).attr('href');
	$('#overlay').fadeIn(500);
	$(a, '#statique').show();
	$('#statique').fadeIn(500);
});

// FONCTION POUR CACHER LA DIV STATIQUE ET SON FOND GRIS OVERLAY
function closeStatique() {
	$('#statique').fadeOut(500);
	$('#overlay').fadeOut(500);
}

// CLIC SUR LE CALQUE GRIS DERRIERE LA DIV STATIQUE POUR FERME LA DIV STATIQUE
$('#overlay').click(function() {
	closeStatique();
});

// TOUCHE ECHAP QUITTE LA DIV STATIQUE
$(document).keyup(function(e) {
	if (e.keyCode == 27) {
		closeStatique();
	}
});

// ANIM DIV DES FILTRES
// TODO: INVERSER LE SENS DES LEGENDES DANS #FILTRES-BOUTON, CHANGER ZONE HOVER
// EN #FILTRES

var t;
var p = 0;

function timedCount() {
	t = setTimeout("closeFilters()", 1000);
}

function closeFilters() {
	if (p == 1) {
		$('#filtres').animate({
			right : '-24.75%'
		}, 500);
		$('#filtres-bouton').animate({
			right : '0.25%'
		}, 500);
		p = 0;
	}
}

$('#filtres').mouseenter(function() {
	if (p == 1) {
		clearTimeout(t);
	}
	if (p == 0) {
		$('#filtres').animate({
			right : '0%'
		}, 500);
		$('#filtres-bouton').animate({
			right : '25%'
		}, 500);
	}
});
$('#filtres').mouseleave(function() {
	p = 1;
	timedCount();
});

// RESIZE SIDEBAR PAR LES PETITS BOUTONS
var sidebartaille = "30%"; // VALEUR PAR DEFAUT (EVOLUTION: ENREGISTRER LA
// DERNIERE VALEUR DE L'UTILISATEUR)

$('#sideplus').click(function() { // ON AGRANDIT LA SIDEBAR+FOOTER, ON
	// AGRANDIT ET REPLACE LA MAP, ON MODIF LA
	// TAILLE DE #STATIQUE
	sidebartaille = sidebartaille.replace("%", "");
	if (sidebartaille <= 75) { // TAILLE MAXIMUM SIDEBAR 75%
		sidebartaille = (parseInt(sidebartaille) + 5) + "%";
		maptaille = sidebartaille.replace("%", "");
		maptaille = (100 - parseInt(maptaille)) + "%";
		$('#autoursidebar').css('width', sidebartaille);
		$('#footer').css('width', sidebartaille);
		$('#map').css('width', maptaille);
		statiqueleft = sidebartaille.replace("%", "");
		statiqueleft = (parseInt(statiqueleft) + 1) + "%";
		$('#statique').css('left', statiqueleft);
		statiquetaille = maptaille.replace("%", "");
		statiquetaille = (parseInt(statiquetaille) - 2) + "%";
		$('#statique').css('width', statiquetaille);
		scrollUpdate;
	}
});

$('#sidemoins').click(function() { // ON RETRECIT LA SIDEBAR+FOOTER, ON
	// AGRANDIT ET REPLACE LA MAP ET RETRECIT LE
	// #STATIQUE
	sidebartaille = sidebartaille.replace("%", "");
	if (sidebartaille >= 35) { // TAILLE MININUM SIDEBAR 25%
		sidebartaille = (parseInt(sidebartaille) - 5) + "%";
		maptaille = sidebartaille.replace("%", "");
		maptaille = (100 - parseInt(maptaille)) + "%";
		$('#autoursidebar').css('width', sidebartaille);
		$('#footer').css('width', sidebartaille);
		$('#map').css('width', maptaille);
		statiqueleft = sidebartaille.replace("%", "");
		statiqueleft = (parseInt(statiqueleft) + 1) + "%";
		$('#statique').css('left', statiqueleft);
		statiquetaille = maptaille.replace("%", "");
		statiquetaille = (parseInt(statiquetaille) - 2) + "%";
		$('#statique').css('width', statiquetaille);
		scrollUpdate;
	}
});

// RESIZE TAILLE POLICE
$('#policeplus').click(function() { // AGRANDIR LA TAILLE DE LA POLICE PAR LES
	// PETITS BOUTONS
	var policetaille = $('body').css('font-size');
	var policetaille = policetaille.replace("px", "");
	var policetaille = (parseInt(policetaille) + 1) + "px";
	$('body').css('font-size', policetaille);
	scrollUpdate;
});
$('#policemoins').click(function() { // DIMINUER LA TAILLE DE LA POLICE PAR
	// LES PETITS BOUTONS
	var policetaille = $('body').css('font-size');
	var policetaille = policetaille.replace("px", "");
	var policetaille = (parseInt(policetaille) - 1) + "px";
	$('body').css('font-size', policetaille);
	scrollUpdate;
});

// CLIC SUR LES ONGLETS DE #TROUVEZ
$('#trouvez .onglet').click(function() {
	if (!$(this).hasClass('actif')) {
		var f = $(this).attr('id');
		if ($(f, '#trouvez').is(":visible") == false) {
			var g = $('#trouvez .onglets .actif').attr('id');
			$('#trouvez .onglets a').removeClass('actif');
			$(this).addClass('actif');
			$('#trouvez div#' + g).fadeOut(500, function() {
				$('#trouvez div#' + f).fadeIn(500, function() {
					$('#trouvez .contenu').animate({
						height : 'auto'
					}, 250);
				});
			});
		}
	}
});


// Hover sur chacun des Itinérennes.
$(".module").delegate(".iti-box", "mouseenter", function() {
	if (!itinerennes_manager.itinerennes[$(this).attr('id').toString()].isVisible()) {
		itinerennes_manager.itinerennes[$(this).attr('id').toString()].show();
	}
});
$(".module").delegate(".iti-box", "mouseleave", function() {
	if (!$(".oeil", this).hasClass("actif")) {
		itinerennes_manager.itinerennes[$(this).attr('id').toString()].hide();
	}
});

// Clic sur l'oeil.
$(".module").delegate(".iti-box .oeil", "click", function() {
	if (!$(this).hasClass("actif")) {
		itinerennes_manager.itinerennes[$(this).parent().parent().parent().attr('id').toString()].show();
	}
	$(this).toggleClass("actif");
});

// MOUSEOVER SUR UN TOOLTIP POUR LE FOCUS ET PREMIER PLAN
var old_zindex = null;
$("#map").delegate(".tooltip", "mouseover", function() {
	old_zindex = $(this).css('z-index');
	$(this).css('z-index', '9999').addClass('focus');
});

$("#map").delegate(".tooltip", "mouseout", function() {
	$(this).css('z-index', old_zindex).removeClass('focus');
});

// MOUSEOVER SUR UN POI DE SIDEBAR POUR AFFICHER LA TOOLTIP CORRESPONDANTE
$(".module").delegate(".iti-box .itineraire .poi", "mouseover", function() {
	var id_etape = $(this).attr('id').replace('t', '');
	var etape = itinerennes_manager.getEtape(id_etape);
	if (etape)
		etape.showMarkerInfo();
	// $('#map #tooltip' +
	// id_etape).show().css('z-index','9999').addClass('focus');
});
$(".module").delegate(".iti-box .itineraire .poi", "mouseout", function() {
	var id_etape = $(this).attr('id').replace('t', '');
	var etape = itinerennes_manager.getEtape(id_etape);
	if (etape)
		etape.hideMarkerInfo();
	// $('#map #tooltip' +
	// id_etape).css('z-index','0').removeClass('focus').hide();
});

function scrollUpdate() {
	return;
}