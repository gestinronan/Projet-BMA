
/**
 * Fichier Serveur projet BMA
 */

// Variable nécéssaire a la création du serveur
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

// Jquery variable
var $ = require('jQuery');

// Variable de contact pour le site de la star
var api_star = http.createClient(80, "http://data.keolis-rennes.com/json/");
var key_star = "FR6UMKCXT1TY5GJ";

var app = express();

// Configuration du serveur 
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

//// HTTP Request vers le site de la star /////

// TEST: Creation de l'url et appel ajax
var url = "http://data.keolis-rennes.com/json/?version=2.0&key=FR6UMKCXT1TY5GJ&cmd=getbikestations";
getData(url);
    
// Création du serveur 
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


// Get Ajax call function
function getData(url){
	
	// Appel vers le serveur
	$.get(url, function(data){
		
		//success call
		console.log(data);
		response = data["data"];
		console.log(response);
	})
}
