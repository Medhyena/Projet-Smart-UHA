var Optimisation = /** @class */ (function () {
    function Optimisation() {
    }
    Optimisation.optimisation_naive = function (points_et_colis, vehicule_id) {
        var vehicule_et_points_et_colis = new Array(4); // nombre de véhicules
        var i;
        for (i = 0; vehicule_id[i] != true; i++)
            ;
        console.log(points_et_colis);
        vehicule_et_points_et_colis[i] = points_et_colis.slice();
        console.log(vehicule_et_points_et_colis);
        return vehicule_et_points_et_colis;
    };
    Optimisation.main = function () {
        var points_et_colis = [[1, 2], [3], [6, 8], [4, 5, 7]]; // chaque point de trajet a des colis à déposer ou à retirer, ici, les colis sont définis par des chiffres, 
        // les points de trajets sont considérés comme sur une ligne de tram, donc dans un ordre plus ou moins logique par rapport aux distances (ici arbitraire)
        var vehicule_id = [false, true, true, false]; // véhicule disponible = true, non disponible = false
        var vehicule_et_points_et_colis;
        vehicule_et_points_et_colis = this.optimisation_naive(points_et_colis, vehicule_id);
        console.log(vehicule_et_points_et_colis);
        return 0;
    };
    return Optimisation;
}());
Optimisation.main();
