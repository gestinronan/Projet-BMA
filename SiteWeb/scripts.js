



// CLIC SUR X POUR FERMER DIV LOADING OU AIDE
$('.aide').delegate('.aide-fermer', 'click', function() {
	hideHelp();
});

// MONTRER DIV LOADING OU AIDE
function showHelp(param) {
	if (param == "load") {
		$('.aide p').html("<img src='http://www.data.rennes-metropole.fr/fileadmin/templates/api/images/logo.jpg' /><br><br>Ce site a remporté le <b>Grand Prix du Jury</b> au<br>concours '<b>Rennes Métropole en accès libre</b>'<br><br><a href='http://www.data.rennes-metropole.fr/le-concours/l-edition-2011/le-palmares-du-concours-rennes-metropole-en-acces-libre-edition-2011/'>Plus d'informations...</a>");
		$('.aide').addClass('chargement');
		$('.aide').show();
}
}
// CACHER DIV LOADING OU AIDE
function hideHelp() {
	$('.aide').removeClass('chargement').hide();
}

// CLIC SUR TITRE LEGENDE POUR MONTRER LA LEGENDE
$('#legende-titre').click(function() {
	$(this).next().slideToggle(300);
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





function scrollUpdate() {
	return;
}