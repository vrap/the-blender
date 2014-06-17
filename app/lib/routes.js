var mongoose = require('mongoose'),
    blender = require('./blender').Blender,
    ModuleModel = require('./model/module'),
    RecipeModel = require('./model/recipe'),
    IngredientModel = require('./model/ingredient'),
    Helper = require('./helper').Helper;

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

        var helper = new Helper();

        // Save a new recipe in the blender
        var recipe = JSON.parse(req.body.data);
        recipe.uuid = helper.generateUuid();
        recipe.created = new Date();
        recipe.updated = null;
        recipe.forked = null;

        // SAve in mongo
        var r = new RecipeModel(recipe);
        r.save(function(err) {
            if (null != err) {
                res.send({
                    status: false
                });
            }
        });

        res.send({
            status: true
        });

    });

    app.get('/api/blender/recipes/:recipe_uid', function(req, res) {
        // Get a recipe available in the blender
        res.send('This is the recipe.');
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
                blender.run(JSON.parse(req.param('recipe')));
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