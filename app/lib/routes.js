var mongoose = require('mongoose'),
    blender = require('./blender').Blender,
    ModuleModel = require('./model/module'),
    RecipeModel = require('./model/recipe'),
    IngredientModel = require('./model/ingredient');

/**
 * Routes for the application
 */
module.exports = function(app) {
    app.get('/api/blender/ingredients', function(req, res) {

        IngredientModel.find(function(err, data) {
            res.send(data);
        })

    })

    // The API to communicate with the Angular app
    app.get('/api/blender/recipes', function(req, res) {
        // Get every recipes available in the blender
        RecipeModel.find(function(err, data) {
            var result = {
                data: data
            };
            res.send(result);
        });

    });

    app.get('/api/blender/recipes/:recipe_uid', function(req, res) {
        // Get a recipe available in the blender
        res.send('This is the recipe.');
    });

    app.post('/api/blender/recipes', function(req, res) {
        // Save a new recipe in the blender
        console.log(req.param("author"));
        res.send('Oh a new recipe ! Thank you my lord');
    });

    app.get('/api/blender/recipes/:recipe_uid', function(req, res) {
        // Get a recipe available in the blender
        res.send('This is the recipe.');
    });

    app.post('/api/blender/recipes/:recipe_uid', function(req, res) {
        // Save a new recipe in the blender
        res.send('Oh a new recipe ! Thank you my lord');
    });

    app.delete('/api/blender/recipes/:recipe_uid', function(req, res) {
        // Delete a recipe in the blender
        res.send('Bye bye sweet recipe ...');
    });

    app.get('/api/blender/availability', function(req, res) {
        var message = {
            status: false
        }

        try {
            message.status = blender.isAvailable();
        } catch (e) {
            message.status = false;
        }

        res.send(message);
    });
    app.post('/api/blender/execute', function(req, res) {
        // Ask the blender to create a recipe (already saved or created by user)
        if (blender.isAvailable()) {
            try {
                blender.run(req.param('recipe'));
            } catch (e) {
                res.send({
                    status: false
                });
            }

            res.send({
                status: true
            })
        } else {
            res.send({
                status: false
            });
        }
    });
};