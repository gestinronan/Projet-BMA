Les fichiers de ce dossier sont utilisé dans le but de récupéré les données 
des différents moyen de transports (Star, Velib, SNCF) et de les intégrés dans 
notre base de donnée.

Les informations les sur arrêts de vélos et de métro sont récupérées grâce à un
appel Ajax vers l'API de keolis.

Pour se qui est des données de bus, elles se trouvent sous le format GTFS dans 
le dossier gtfsDataStar et gtfsDataSncf

Action des différents fichier:

getBikesStation.js:

L'exécution de se fichier réalise un appel ajax vers l'API de keolis. La requête 
récupère les données des arrets de vélos sous la forme d'un JSON. 
Une fois se JSON récupéré, il est parsé et les informations suivante sont ajoutées 
à la collection bikeStations:
	 id: Id donné par l'API de kéolis à l'arret de vélo
	 name: nom donné à l'arret de vélo par l'API
	 longitude: longitude à laquelle se trouve l'arret de vélo
	 latitude: latitude à laquelle se trouve l'arret de vélo
	 
	 
getMetroStation.js

L'exécution de se fichier réalise un appel ajax vers l'API de keolis. La requête 
récupère les données des arrets de métros sous la forme d'un JSON. 
Une fois se JSON récupéré, il est parsé et les informations suivante sont ajoutées 
à la collection metroStations:
	 id: Id donné par l'API de kéolis à l'arret de métro
	 name: nom donné à l'arret de métro par l'API
	 longitude: longitude à laquelle se trouve l'arret de métro
	 latitude: latitude à laquelle se trouve l'arret de métro
	 
getBusStations.js

L'éxécution de se fichier va parcourir le fichier stops.txt des données GTFS récupérées
sur le serveur de la Star. Lors du parcours de se fichier, nous récupérons les informations
nécessaire à la localisation des arrêts de bus.
Les données suivantes sont enregistrées dans la collection busStations:
	stop_id: Id donnée par l'API de kéolis à l'arret de bus
	stop_name: Nom donnée par la Start à l'arret de bus
	stop_lon: Longitude de l'arrêt de bus
	stop_lat: Latitude de l'arrêt de bus
	
getBusStopTimes.js

L'éxécution de ce fichier va parcourir le fichier stop_times.txt des données GTFS récupérées
sur le serveur de la Star. Ce fichier contient tous les horaires de bus.
Les données suivantes sont enregistrées dans la collection busStopTimes:
	stop_id: Id de l'arret de bus concerné
	trip_id: Id du voyage en cour
	arrival_time: Heure d'arrivée du bus
	departure_times: Heure de départ du bus
	stop_sequence:
	
getBusTrips.js

L'exécution de ce fichier va parcourir le fichier trips.txt. Ce fichier contient les différents
voyages possible. 
Les données suivantes sont enregistrées dans la collection busTrips:
	trip_id: Id du voyage
	route_id: Id de ligne de bus
	direction_id: Contient le sens du voyage
	service_id: 
	
getBusRoutes.js

L'éxécution de ce fichier va parcourir le fichier routes.txt. Ce fichier contient les noms et numéros
des lignes de bus. 
Les données suivantes sont enregistrées dans la collection busRoutes:
	route_id: Id données a la ligne de bus
	route_short_name: Numéro de la ligne de bus
	route_long_name: Nom de la ligne de bus
	
getLinesBusForEachStation.js

Ce fichier a pour but de d'ajouter à la collection busStations les lignes de bus qui sont 
déservis a cet arrêt. 
Les données suivantes sont ajouté à la collection busStation:
	line_id: id de la ligne de bus
	line_short_name: numéro de la ligne de bus
	line_long_name: nom de la ligne de bus