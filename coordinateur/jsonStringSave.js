let jsonStringAllInfos;
let adresse_batiments = new Map();

adresse_batiments.set("1 Rue Alfred Werner", 0);
adresse_batiments.set("15 Rue des Frères Lumière", 1);
adresse_batiments.set("2 rue des Frères Lumière", 2);
adresse_batiments.set("3 Rue Alfred Werner", 3);
adresse_batiments.set("6 Rue des Frères Lumière", 4);
adresse_batiments.set("3 Rue Alfred Werner", 5);
adresse_batiments.set("2 Rue des Frères Lumière", 6);
adresse_batiments.set("10 Rue des Frères Lumière", 7);
adresse_batiments.set("11 Rue Alfred Werner", 8);
adresse_batiments.set("21 Rue Alfred Werner", 9);
adresse_batiments.set("12 Rue des Frères Lumière", 10);
adresse_batiments.set("15 Rue Jean Starcky", 11);
adresse_batiments.set("18 Rue des Frères Lumière", 12);

// Map inverse pour fabriquer la vue (oui je sais pas programmer)
let reverse_map = new Map();

reverse_map.set(0, "1 Rue Alfred Werner");
reverse_map.set(1, "15 Rue des Frères Lumière");
reverse_map.set(2, "2 rue des Frères Lumière");
reverse_map.set(3, "3 Rue Alfred Werner");
reverse_map.set(4, "6 Rue des Frères Lumière");
reverse_map.set(5, "3 Rue Alfred Werner");
reverse_map.set(6, "2 Rue des Frères Lumière");
reverse_map.set(7, "10 Rue des Frères Lumière");
reverse_map.set(8, "11 Rue Alfred Werner");
reverse_map.set(9, "21 Rue Alfred Werner");
reverse_map.set(10, "12 Rue des Frères Lumière");
reverse_map.set(11, "15 Rue Jean Starcky");
reverse_map.set(12, "18 Rue des Frères Lumière");

// Trie les informations venant d'oxycar pour en faire un tableau
function parseJSONintoArray(json) {
  let id = 0;
  let tab = [[], [], [], [], [], [], [], [], [], [], [], [], []];
  let parsed = JSON.parse(json);
  parsed.forEach(trajet => {
    tab[adresse_batiments.get(trajet.road.origin.gps_address)].push([
      id,
      adresse_batiments.get(trajet.road.destination.gps_address)
    ]);
    id++;
  });
  return tab;
}

module.exports = {
  set: function(json) {
    jsonStringAllInfos = parseJSONintoArray(json);
    return;
  },
  // TODO une fonction pour récupérer et ajouter les données des véhicules dans le tableau (pour l'algorithme d'opitmisation)
  get: function() {
    return jsonStringAllInfos;
  },
  // Fonction pour rendre humainement lisible le tableau dans la vue
  vuetify: json => {
    if (json === undefined) return [];
    let i = 1;
    let ret = [];
    json.forEach(voiture => {
      if (voiture === null) {
        ret.push([`La voiture n°${i} n'a pas de trajets.`]);
      } else {
        let s = [`La voiture n°${i} : `];
        let j = 0;
        const voiture_object = JSON.parse(voiture);
        voiture_object.forEach(batiment => {
          if (batiment !== []) {
            batiment.forEach(colis => {
              s.push(
                `doit livrer le colis n°${
                  colis[0]
                } de l'adresse ${reverse_map.get(
                  j
                )} à l'adresse ${reverse_map.get(colis[1])}`
              );
            });
          }
          j++;
        });
        ret.push(s);
      }
      i++;
    });
    return ret;
  }
};
