/**
 * Module dependencies.
 */
var Server = require('./lib/server').Server,
    Five   = require('johnny-five');

// Instanciate the server.
var server = new Server();

// Start the server.
server.init(5555);
