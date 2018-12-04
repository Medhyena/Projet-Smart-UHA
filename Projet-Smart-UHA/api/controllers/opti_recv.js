'use strict';

module.exports = {
    opti_recv: opti_recv
}

var jsonStringSave = require('./jsonStringSave');

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function opti_recv(req, res) {
    res.json(jsonStringSave.get());
}
