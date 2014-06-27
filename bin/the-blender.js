#!/usr/bin/env node

'use strict';

process.bin = process.title = 'The Blender';

/**
 * Module dependencies.
 */
var config = require('../config/config'),
    mongoose = require('mongoose'),
    blender = require('../app/lib/blender').Blender,
    Server = require('../app/lib/server').Server,
    RecipeModel = require('../app/lib/model/recipe'),
    deferred = require('deferred');

deferred.profile();

// Initialize db connexion
mongoose.connect(config.database.url);
var db = mongoose.connection;

// Initialize Blender
blender.init().done(function() {
    // Instanciate the server
    var server = new Server();

    // Start the server
    server.init(config.server.port);

    // Setting the routes
    require('../app/lib/routes')(server.app);

    console.info('[Blender][infos] Blender is ready, visit http://localhost:' + config.server.port + '/');

});