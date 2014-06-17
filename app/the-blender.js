/**
 * Module dependencies.
 */
var config = require('../config/config'),
    mongoose = require('mongoose'),
    blender = require('./lib/blender').Blender,
    Server = require('./lib/server').Server,
    RecipeModel = require('./lib/model/recipe'),
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
    require('./lib/routes')(server.app);

    console.info('[Blender][infos] Blender is ready, visit http://localhost:' + config.server.port + '/');
    
});