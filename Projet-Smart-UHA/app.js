'use strict';


var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var JSonStringAllInfos;

// Variable stockant les données
app.set('JSonStringAllInfos', JSonStringAllInfos);

var config = {
  appRoot: __dirname // required config
};


SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  console.log("Server is LIVE");

});
