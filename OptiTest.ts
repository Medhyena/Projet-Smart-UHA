class Optimisation {

    public static optimisation_naive(points_et_colis:number[][], vehicule_id:boolean[]): number[][][] {
        let vehicule_et_points_et_colis:number[][][] = new Array(4); // nombre de véhicules
        let i:number;
        for (i = 0; vehicule_id[i] != true; i++);
        console.log(points_et_colis);
        vehicule_et_points_et_colis[i] = points_et_colis.slice();
        console.log(vehicule_et_points_et_colis);
        return vehicule_et_points_et_colis;
    }

    public static main(): number {
        let points_et_colis:number[][] = [ [1, 2], [3], [6, 8], [4, 5, 7] ]; // chaque point de trajet a des colis à déposer ou à retirer, ici, les colis sont définis par des chiffres, 
                                                        // les points de trajets sont considérés comme sur une ligne de tram, donc dans un ordre plus ou moins logique par rapport aux distances (ici arbitraire)
        let vehicule_id:boolean[] = [false, true, true, false]; // véhicule disponible = true, non disponible = false
        let vehicule_et_points_et_colis:number[][][];
        vehicule_et_points_et_colis = this.optimisation_naive(points_et_colis, vehicule_id);
        console.log(vehicule_et_points_et_colis);
        return 0;
    }
}

Optimisation.main();