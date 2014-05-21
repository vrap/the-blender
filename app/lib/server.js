/**
 * Module dependencies.
 */
var express = require('express'),
    http = require('http'),
    app = express(),
    io = require('socket.io'),
    winston = require('winston');


/**
 * Server prototype.
 *
 * @param {[type]} config [description]
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

    // Initialize http server.
    this.server = http.createServer(app);
    this.server.listen(port);
    this.socket = io.listen(
        this.server, {
            logger: {
                debug: winston.debug,
                info: winston.info,
                error: winston.error,
                warn: winston.warn
            }
        }
    );
};