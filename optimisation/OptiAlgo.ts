declare function require(name: string);
const wslibrary = require("ws");

// Variable des données utilisées et récupérées depuis le serveur pour l'algorithme d'optimisation
var points_et_colis: number[][][];

// Fonction d'optimisation naïve
function optimisationNaive(vehicule_id: boolean[]): number[][][][] {
  let vehicule_et_points_et_colis: number[][][][] = new Array(4); // nombre de véhicules
  let i: number;

  // Récupère le premier véhicule libre
  for (i = 0; vehicule_id[i] != true; i++);

  vehicule_et_points_et_colis[i] = points_et_colis.slice();

  // Premier véhicule libre devient indisponible
  vehicule_id[i] = false;

  // Affichage des données optimisées qui vont être envoyées (utile pour le test)
  console.log(vehicule_et_points_et_colis);
  return vehicule_et_points_et_colis;
}

// Fonction préparant la connexion WebSocket
function connexionServeurWebSocket(ip_du_serveur: String, port_du_serveur: String) {
  let ws = new wslibrary("ws://" + ip_du_serveur + ":" + port_du_serveur + "/");

  // Connexion au serveur
  ws.on("open", function open() {
    console.log("Succesfully connected!");
  });

  // Fonction exécutée quand on reçoit un message
  ws.on("message", function incoming(data) {
    // Affichage des données reçues
    console.log(data);

    // Copie des données reçues
    points_et_colis = data;

    // Véhicule disponible = true, non disponible = false, pour l'instant hardcoded
    let vehicule_id: boolean[] = [false, true, true, false];

    // Envoi des données optimisées vers le serveur
    ws.send(JSON.stringify(optimisationNaive(vehicule_id)));
  });
}

// Il faut mettre l'IP du serveur ici
var ip_du_serveur = "localhost";

// Il faut mettre le port sur lequel écoute le serveur ici
var port_du_serveur = "10010";

// Connexion au serveur WebSocket
connexionServeurWebSocket(ip_du_serveur, port_du_serveur);
