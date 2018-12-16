"use strict";

const jsonStringSave = require("./jsonStringSave");

const app = require("express")();
const bodyParser = require("body-parser");
const cron = require("node-cron");
const request = require("request");
const server = require("http").createServer();
const WebSocket = require("ws");

// Paramètres pour le moteur de templates
app.set("views", "./views");
app.set("view engine", "pug");

// Insertion du middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Variables de connection et de trajets
let keys;
let trajets;
let connected = false;

// Fonction de connexion au server Oxycar
const connection = () => {
  const data = {
    login: "daniel.wettel@uha.fr",
    password: "password1234"
  };

  const postData = JSON.stringify(data);

  const options = {
    url: "http://localhost:8095/auth/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: postData
  };

  request(options, (err, response, body) => {
    if (err) {
      console.log(err);
      connected = false;
      keys = null;
    } else {
      if (response.statusCode === 200) {
        keys = JSON.parse(response.body);
        connected = true;
      } else {
        console.log(response.statusCode);
        connected = false;
        keys = null;
      }
    }
  });
};
// Exécution de la fonction (1 seule fois)
connection();

// Fonction pour récupérer les trajets
const getTrajets = () => {
  if (connected) {
    const data = {
      start_date: new Date(),
      end_date: "2051-01-30T23:00:00.000Z",
      backend_url: keys.backend.server_url
    };

    const postData = JSON.stringify(data);

    const options = {
      url: `http://localhost:8095/events/${
        keys.customer.customer.cust_uuid
      }/calendar`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: keys.apikey
      },
      body: postData
    };

    request(options, (err, response, body) => {
      if (err) {
        console.log(err);
        trajets = null;
      } else {
        if (response.statusCode === 200) {
          trajets = response.body;
          jsonStringSave.set(trajets);
        } else {
          console.log(response.statusCode);
          trajets = null;
        }
      }
    });
  }
};
// Exécution de la fonction toute les minutes
cron.schedule("* * * * *", getTrajets);

// Création du serveur WebSocket
const wss = new WebSocket.Server({
  server: server
});

// A remplacer par la vraie variable
var points_et_colis_test = [[[1, 1], [2, 1]], [[3, 2]]];
var tableau_de_connexions = [];

wss.on("connection", function connection(ws) {
  // Un algorithme d'optimisation se connecte, ce code est exécuté

  // Fonction qui effectue une action quand un algorithme d'optimisation envoie un message vers ce serveur
  ws.on("message", function incoming(message) {
    // Code à modifier pour renvoyer vers les véhicules
    console.log("received: " + message);
  });

  // On stocke la fonction d'envoi dans un tableau pour choisir à quel algorithme on envoie le trajet à optimiser
  var send;
  function send() {
    ws.send(JSON.stringify(points_et_colis_test));
  }
  send.bind(send);
  tableau_de_connexions.push(send);
});

// Fonction permettant d'envoyer les trajets aux algos (à modifier pour pouvoir choisir quels algos)
function send_to_algo() {
  if (tableau_de_connexions != undefined) {
    tableau_de_connexions[0]();
  }
}

// Envoie régulier aux algos choisis
cron.schedule("* * * * *", send_to_algo);

// Le serveur écoute sur le port 10010
server.on("request", app);
server.listen(10010);
