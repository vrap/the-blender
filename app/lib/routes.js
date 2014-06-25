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

    app.get('/api/blender/modules', function(req, res) {

        ModuleModel
            .find()
            .sort('order')
            .exec(function(err, data) {
                res.send(data);
            });

    });

    app.post('/api/blender/modules', function(req, res) {
        // Save a new module
        try {
            var module = JSON.parse(req.param('module'));
            var m = new ModuleModel(module);
            m.save(function(err) {
                if (null != err) {
                    res.send({
                        status: false
                    });
                }
            });
        } catch (e) {
            res.send({
                status: false
            });
        }

        res.send({
            status: true
        })
    });

    app.put('/api/blender/modules', function(req, res) {
        // Edit a module
        try {
            var module = JSON.parse(req.param('module'));
            ModuleModel.update(
                {order: module.order},
                {
                    type: module.type,
                    content: module.content,
                    components: module.components
                },
                function (err, numberAffected, raw) {
                    if (null != err) {
                        res.send({
                            status: false
                        });
                    }
                }
            );
        } catch (e) {
            res.send({
                status: false
            });
        }

        res.send({
            status: true
        })
    });

    app.delete('/api/blender/modules/:module_order', function(req, res) {
        // Edit a module
        try {
            // Delete object
            ModuleModel.remove(
                {order: req.params.module_order},
                function(err) {
                    if(null != err) {
                        res.send({
                            status: false
                        });
                    }

                    //Others modules have to be updated
                    ModuleModel.find(
                        {order: {$gt: req.params.module_order}},
                        function (err, data) {
                            if (null != err) {
                                res.send({
                                    status: false
                                });
                            }

                            for(var i in data) {
                               ModuleModel.update(
                                   {order: data[i].order},
                                   {order: data[i].order-1},
                                   function (err, numberAffected, raw) {
                                       if (null != err) {
                                           res.send({
                                               status: false
                                           });
                                       }
                                   }
                               )
                            }
                        }
                    )


                }
            )
        } catch (e) {
            console.log(e);
            res.send({
                status: false
            });
        }

        res.send({
            status: true
        })
    });

    app.get('/api/blender/ingredients', function(req, res) {

        IngredientModel.find(function(err, data) {
            res.send(data);
        })

    });

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

    app.post('/api/blender/recipes', function(req, res) {

        var helper = new Helper();

        // Save a new recipe in the blender
        var recipe = JSON.parse(req.body.data);

        recipeExiste = RecipeModel.find({uuid : recipe.uuid}, function(err, data){
            console.log(err, data);
        })


        recipe.uuid = recipe.uuid || helper.generateUuid();
        recipe.created = recipe.created || new Date();
        recipe.updated = recipe.updated || null;
        recipe.forked = recipe.forked || null;

        // SAve in mongo
        var r = new RecipeModel(recipe);
        r.save(function(err) {
            if (null != err) {
                res.send({
                    status: false,
                    data : { msg : 'Something wrong happened.' }
                });
            }
        });

        res.send({
            status: true,
            data: { msg : 'Great a new cocktail saved !' }
        });
    });

    app.put('/api/blender/recipes', function(req, res) {
        // Update a recipe in the blender
        var recipe = JSON.parse(req.body.data);
        recipe.created = recipe.created || new Date();
        recipe.updated = recipe.updated || null;
        recipe.forked = recipe.forked || null;

        // SAve in mongo
        RecipeModel.update(
            {uuid: recipe.uuid},
            {
                name: recipe.name,
                updated: recipe.updated,
                steps: recipe.steps
            },
            function(err, numberAffected, raw) {
                if(null != err) {
                    res.send({
                        status: false,
                        data : { msg : 'Something wrong happened.' }
                    });
                }
            }
        );

        res.send({
            status: true,
            data: { msg : 'Cocktail updated!' }
        });
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