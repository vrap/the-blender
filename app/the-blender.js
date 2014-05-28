/**
 * Module dependencies.
 */
var Server = require('./lib/server').Server,
	Blender = require('./lib/blender/blender').Blender,
	Master = require('./lib/blender/master').Master,
	Pourer = require('./lib/blender/pourer').Pourer,
	Recipe = require('./lib/recipe/recipe').Recipe,
	Step = require('./lib/recipe/step').Step,
	Parameter = require('./lib/recipe/parameter').Parameter,
    Five   = require('johnny-five'),
	database = require('../config/database');

// Instanciate the server.
var server = new Server();

// Start the server.
server.init(5555);

// Setting the routes
require('../config/routes')(server.app);