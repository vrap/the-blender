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
    Five   = require('johnny-five');

// Instanciate the server.
var server = new Server();

// Start the server.
server.init(5555);

/**
 * Setting the routes
 */
// The API to communicate with the Angular app
server.app.get('/api/blender/recipes', function(req, res) {
	// Get every recipes available in the blender
	console.log('These are my recipes.');
});

server.app.post('/api/blender/recipes/:recipe_uid', function(req, res) {
	// Save a new recipe in the blender
	console.log('Oh a new recipe ! Thank you my lord');
});

server.app.delete('/api/blender/recipes/:recipe_uid', function(req, res) {
	// Delete a recipe in the blender
	console.log('Bye bye sweet recipe ...');
});

server.app.post('/api/blender/execute/:recipe_uid', function(req, res) {
	// Ask the blender to create a recipe (already saved or created by user)
	console.log('More work ! Yes my lord !');
});
