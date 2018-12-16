var points_et_colis;
var wslibrary = require('ws');
function optimisationNaive(vehicule_id) {
    var vehicule_et_points_et_colis = new Array(4); // nombre de véhicules
    var i;
    for (i = 0; vehicule_id[i] != true; i++)
        ;
    console.log(points_et_colis);
    vehicule_et_points_et_colis[i] = points_et_colis.slice();
    vehicule_id[i] = false;
    console.log(vehicule_et_points_et_colis);
    return vehicule_et_points_et_colis;
}
function connexionServeurWebSocket(ip_du_serveur, port_du_serveur) {
    var ws = new wslibrary('ws://' + ip_du_serveur + ':' + port_du_serveur + '/');
    console.log('ws://' + ip_du_serveur + ':' + port_du_serveur + '/');
    ws.on('open', function open() {
        console.log("Succesfully connected!");
    });
    ws.on('message', function incoming(data) {
        console.log(data);
        points_et_colis = data;
        var vehicule_id = [false, true, true, false]; // véhicule disponible = true, non disponible = false
        ws.send(JSON.stringify(optimisationNaive(vehicule_id)));
    });
}
var points_et_colis_test = [[[1, 1], [2, 1]], [[3, 2]]]; // chaque point de trajet a des colis à retirer avec leur points de trajets à déposer,
// ici, les colis sont définis par des chiffres comme des identifiants, 
// les points de trajets sont considérés comme sur une ligne de tram, donc dans un ordre plus ou moins logique par rapport aux distances (ici du plus bas au plus haut)
var vehicule_et_points_et_colis;
//vehicule_et_points_et_colis = this.optimisationNaive(vehicule_id);
var ip_du_serveur = "localhost";
var port_du_serveur = "10010";
connexionServeurWebSocket(ip_du_serveur, port_du_serveur);
