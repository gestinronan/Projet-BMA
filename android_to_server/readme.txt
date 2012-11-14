Cette application anroid a pour but de tester la communication entre le téléphone
et le serveur.


///////////////////
////Le 13/11/12////
///////////////////

Fichier MainClass:

- Ajout d'un Handler permettant de gérer la progress bar
- Ajout de la progress pour les fonction GET et POST
- Ajout d'un bouton pour passer d'une vue à l'autre

Fichier ListViewClass:

- Meilleur traitement du Json


///////////////////
////Le 10/11/12////
///////////////////

Le fichier MainClass contient les méthodes suivantes:

- Récupération des données de géolocalisation du téléphone
- Fonction qui post des données sur le serveur
- Fonction qui GET les données sur le serveur
- Traitement du JSON.
- Intent vers le fichier ListViewClass

Le fichier ListViewClass contient les méthodes suivantes:

- Récupération des données de l'intent
- Traitement du Json 
- Création d'une Map
- Création d'une ListView

Le fichier MyLocationListener contient les méthodes suivantes:

- Mise a jour des données de géolocalisation
- Listener sur les changement de position
- Listener sur l'activation ou non de la géolocalisation

