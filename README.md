Installation de l'API oxycar/uha

Dans le dossier de l'API:
Ouvrir une invite de commandes :
git clone https://gitlab.com/smart-uha/smart-api.git
cd smart-api
npm install -g swagger
npm install -g typescript
npm install
npm install -D

cp config/config.default.json config/config.json

SI PROBLEME avec lodash :
npm install event-stream@3.3.5
npm install lodash

Pour lancer l'API:
npm run watch

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

Installation du coordinateur:

Dans le dossier du coordinateur
Ouvrir une invite de commande:
npm install

Pour lancer le coordinateur:
node app.js

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

Installation de l'algorithme d'optimisation:

Dans le dossier de l'algorithme d'optimisation
Ouvrir une invite de commande:
npm install

Pour lancer l'algorithme d'optimisation, il faut que le serveur donc le coordinateur soit déjà en train de marcher:
tsc OptiAlgo.ts
node OptiAlgo.js

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

Utilisation du programme:

Exécuter "npm run watch" dans le dossier smart-api
Exécuter "node app.js" dans le dossier coordinateur
Exécuter "node OptiAlgo.js" dans le dossier optimisation

Attendre environ 1 minute pour voir les premiers échanges apparaîtrent

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

Format de données actuellement utilisé:

- Les données de véhicules sont prises à part
- Le tableau de données est fait comme suit : Un tableau de points de trajet. Chaque point de trajet est lui-même un tableau et correspond à un point sur le campus, dans notre cas, ils sont dans l'ordre du plus bas vers le plus haut. Dans chaque point de trajet, on a des colis à chercher. Ces colis sont eux-mêmes des tableaux de 2 cases, la première case contenant un ID de colis, et la deuxième la destination du colis (en point de trajet)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

Parties de code à modifier dans le futur:

Dans app.js :
- id_algorithme correspond à l'algorithme que l'on souhaite utiliser, pour l'instant, il utilise le premier algorithme qui se connecte au serveur
- A la fin du fichier, on peut changer le port du serveur sur la commande server.listen
- On peut aussi changer les paramètres du serveur WebSocket dans la création de celui-ci
- Pour l'instant, il n'existe aucune communication avec le/les véhicule(s). Comme nous ne savons pas quelle technologie sera utilisée, nous n'avons pas de templates préfaits avec bouchon.
Cela implique de changer le code pour communiquer avec les véhicules mais aussi pour gérer les données que les véhicules peuvent nous donner
- Nous utilisons un serveur de test temporaire pour nous connecter au serveur d'oxycar

Dans jsonStringSave.js :
- Pour l'instant, les colis sont des clients, donc il faudra probablement changer le code pour parser le json que l'on reçoit d'oxycar
- Il faudra aussi adapter le fichier pour recevoir et envoyer les données des véhicules (ajout d'une fonction, changer le format de données/agrandir le tableau, etc...)

Dans OptiAlgo.ts/OptiAlgo.js :
- Pour l'instant, les données des véhicules sont hardcoded et donc inscrites directement dans le fichier, il faudra donc adapter avec les nouvelles données que recevra l'algorithme (ainsi que celles que l'algorithme devra renvoyer)
