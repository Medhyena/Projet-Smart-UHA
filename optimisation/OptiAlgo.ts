declare function require(name: string);
const wslibrary = require("ws");

var points_et_colis: number[][][];

// Fonction d'optimisation naïve
function optimisationNaive(vehicule_id: boolean[]): number[][][][] {
  let vehicule_et_points_et_colis: number[][][][] = new Array(4); // nombre de véhicules
  let i: number;
  for (i = 0; vehicule_id[i] != true; i++);
  console.log(points_et_colis);
  vehicule_et_points_et_colis[i] = points_et_colis.slice();
  vehicule_id[i] = false;
  console.log(vehicule_et_points_et_colis);
  return vehicule_et_points_et_colis;
}

// Fonction préparant la connexion WebSocket
function connexionServeurWebSocket(
  ip_du_serveur: String,
  port_du_serveur: String
) {
  let ws = new wslibrary("ws://" + ip_du_serveur + ":" + port_du_serveur + "/");
  console.log("ws://" + ip_du_serveur + ":" + port_du_serveur + "/");
  ws.on("open", function open() {
    console.log("Succesfully connected!");
  });

  // Fonction exécutée quand on reçoit un message
  ws.on("message", function incoming(data) {
    console.log(data);
    points_et_colis = data;
    let vehicule_id: boolean[] = [false, true, true, false]; // véhicule disponible = true, non disponible = false
    ws.send(JSON.stringify(optimisationNaive(vehicule_id)));
  });
}

// Il faut mettre l'IP du serveur ici
var ip_du_serveur = "localhost";
// Il faut mettre le port sur lequel écoute le serveur ici
var port_du_serveur = "10010";
connexionServeurWebSocket(ip_du_serveur, port_du_serveur);
