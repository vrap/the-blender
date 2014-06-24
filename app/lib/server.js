/**
 * Module dependencies.
 */
var express = require('express'),
    http = require('http'),
    app = express(),
    io = require('socket.io'),
    bodyParser = require('body-parser');

/**
 * Server prototype.
 */
exports.Server = Server = function() {};

/**
 * Initialize the server on the specified port.
 *
 * @this {Server}
 * @param {Number} port The port to listen.
 * @return {Server} for chaining.
 * @api public
 */
Server.prototype.init = function(port) {
    // Define static ressources from express.
    app.use(express.static(__dirname + '/../../public'));
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded())

    // Initialize http server.
    app.listen(port);
    this.app = app;
    this.server = http.createServer(app);
    this.socket = io.listen(
        this.server
    );

    return this;
};