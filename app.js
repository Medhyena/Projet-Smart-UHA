'use strict';

var app = require('express')();
var WebSocket = require('ws');
var jsonStringSave = require('./jsonStringSave');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

const cron = require("node-cron");
const request = require("request");
const bodyParser = require("body-parser");

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
          } else {
            console.log(response.statusCode);
            trajets = null;
          }
        }
      });
    }
    console.log(trajets);
    jsonStringSave.set(trajets);
};
// Exécution de la fonction toute les minutes
cron.schedule("* * * * *", getTrajets);

const wss = new WebSocket.Server({ 
  port: 8080 
});

wss.on('connection', function connection(ws) {
  // un algorithme d'optimisation se connecte, ce code est exécuté

  // cette fonction effectue une action quand un algorithme d'optimisation envoie un message vers ce serveur
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  // cette fonction envoie un message vers l'algorithme qui s'est connecté
  ws.send('something');
});

function sendTrajets() {
  //optiAlgoWebSocket1.send(jsonStringSave.get());
}

cron.schedule("* * * * *", sendTrajets);