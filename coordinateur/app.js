"use strict";

// Variable à modifier selon quel algorithme veut être utilisé, pour l'instant, elle prend le premier qui se connecte
var id_algorithme = 0;
// Variable permettant de vérifier que les trajets ont changé
var old_json_string;

// Dépendances du projet
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
          // code utilisé pour créer le bouchon
          /*
          require("fs").writeFile(
            "bouchon.txt",
            JSON.stringify(trajets),
            err => {
              if (err) throw err;
              console.log("The file has been saved!");
            }
          );*/
          jsonStringSave.set(trajets);
        } else {
          console.log(response.statusCode);
          trajets = null;
        }
      }
    });
  } else {
    console.log("Non connecté, utilisation du bouchon.");
    require("fs").readFile("bouchon.txt", (err, data) => {
      if (err) throw err;
      jsonStringSave.set(JSON.parse(data));
    });
  }
};

// Exécution de la fonction toutes les minutes
cron.schedule("* * * * *", getTrajets);

// Création du serveur WebSocket
const wss = new WebSocket.Server({
  server: server
});

// Tableau des algorithmes qui se sont connectés
let tableau_de_connexions = [];
// Tableau des trajets pour chaque voiture
let tableau_de_voitures;

wss.on("connection", function connection(ws) {
  // Un algorithme d'optimisation se connecte, ce code est exécuté

  // Fonction qui effectue une action quand un algorithme d'optimisation envoie un message vers ce serveur
  ws.on("message", function incoming(message) {
    // Code à modifier pour renvoyer vers les véhicules
    console.log("received: " + message);
    tableau_de_voitures = JSON.parse(message);
  });

  // On stocke la fonction d'envoi dans un tableau pour choisir à quel algorithme on envoie le trajet à optimiser
  tableau_de_connexions.push(() => {
    ws.send(JSON.stringify(jsonStringSave.get()));
  });
});

// Fonction permettant d'envoyer les trajets aux algos (à modifier pour pouvoir choisir quels algos)
function send_to_algo() {
  // Vérification d'un trajet en doublon
  if (old_json_string == undefined || old_json_string != jsonStringSave.get()) {
    // Vérification de l'existence de l'algorithme dans le tableau des algorithmes
    if (tableau_de_connexions[id_algorithme] !== undefined) {
      // Copie des données pour la prochaine vérification du doublon
      old_json_string = jsonStringSave.get();

      // Envoi des données vers l'algorithme d'optimisation choisi
      tableau_de_connexions[id_algorithme]();
    }
  }
}

// Envoie régulier toutes les minutes aux algos choisis
cron.schedule("* * * * *", send_to_algo);

// Route servant à visualiser l'état des données
app.get("/", function(req, res) {
  res.render("index", {
    connected: connected,
    trajets: jsonStringSave.vuetify(tableau_de_voitures)
  });
});

// Le serveur écoute sur le port 10010
server.on("request", app);
server.listen(10010);
