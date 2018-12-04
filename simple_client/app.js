const cron = require("node-cron");
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();

const PORT = 5000;

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
};
// Exécution de la fonction toute les minutes
cron.schedule("* * * * *", getTrajets);

// Route principale (localhost:5000)
app.get("/", function(req, res) {
  res.render("index", { connected: connected, trajets: trajets });
});

app.listen(PORT, console.log(`Serveur démarré sur le port ${PORT}`));
