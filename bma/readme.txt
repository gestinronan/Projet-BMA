/// README

Démarrer le serveur : node app.js

Package a installer:

express: npm install express -g
jquery: npm install jquery // import jquery sur le serveur
where: npm install where // utilisé pour calculer la distance entre deux points https://npmjs.org/package/where 
mongodb: npm install mongodb // Database used
mongoose: npm install mongoose // USe to control the database from nodejs
mongojs: npm install mongojs // needed to conenct to the database
jsoncsv: npm install jsoncsv // Convert csv file (GTFS) to json

Lancer une nouvelle application avec express: express --sessions --css stylus --ejs myapp

Atteindre le serveur: http://localhost:3000


Dans le dossier view: se trouve tous les template. 
Dans le dossier public: se trouveront toutes les images et fichier static en cas de création de site.



/************ DATABASE ************/

Switch to a database: use stops
Show what is in the database: show collections
Remove a collection from the database: db.bikeStations.remove({})

Table: Stops: contains one collection with the bike stations 
			  contains one collection with the metro stations
			  contains one collection with the bus stations
			  contains one collection with all the stops
			 
			  Contains a collection with all the lines