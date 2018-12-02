declare function require(name:string);
var express = require("express");
var app = express();
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

// on peut aussi le faire avec swagger: voir cette possibilité