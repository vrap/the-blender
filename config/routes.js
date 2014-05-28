/**
 * Routes for the application
 */

module.exports = function(app) {
	// The API to communicate with the Angular app
	app.get('/api/blender/recipes', function(req, res) {
		// Get every recipes available in the blender
		res.send('These are my recipes.');
	});

	app.post('/api/blender/recipes/:recipe_uid', function(req, res) {
		// Save a new recipe in the blender
		res.send('Oh a new recipe ! Thank you my lord');
	});

	app.delete('/api/blender/recipes/:recipe_uid', function(req, res) {
		// Delete a recipe in the blender
		res.send('Bye bye sweet recipe ...');
	});

	app.post('/api/blender/execute/:recipe_uid', function(req, res) {
		// Ask the blender to create a recipe (already saved or created by user)
		res.send('More work ! Yes my lord !');
	});
};