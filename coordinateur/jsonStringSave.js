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
  get: function() {
    return jsonStringAllInfos;
  }
};
