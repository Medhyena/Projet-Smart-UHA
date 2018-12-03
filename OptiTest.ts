declare function require(name:string);
var express = require("express");
var app = express();

// Variable contenant les informations des trajets et des colis
var JSONStringAllInfos:String;

app.listen(3000, () => {
 console.log("Server running on port 3000");
});


// on peut aussi le faire avec swagger: voir cette possibilité