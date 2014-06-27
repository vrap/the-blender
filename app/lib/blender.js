var config = require('../../config/config'),
    Five = require('johnny-five'),
    mongoose = require('mongoose'),
    ModuleModel = require('./model/module'),
    IngredientModel = require('./model/ingredient'),
    Cart = require('./cart').Cart,
    fs = require('fs'),
    path = require('path'),
    deferred = require('deferred');

// Dynamically load existings modules with require
fs.readdirSync(path.resolve(__dirname, 'module/')).forEach(function(file) {
    require('./module/' + file);
});

/**
 * Blender prototype
 * @type {Blender}
 */
var Blender = function() {};

Blender.prototype.available = false;

Blender.prototype.isAvailable = function() {
    return this.available;
};

/**
 * Initializes the Blender with its modules or set it as an object
 * @param {Array} modules
 */
Blender.prototype.init = function() {
    var dfd = deferred();

    console.info('[Blender][infos] Updating ingredients database from master ...');
    var pIngredient = this.updateIngredient();
    pIngredient.done(function() {
        console.info('[Blender][infos] Ingredient updated successfully');
    });

    console.info('[Blender][infos] Connecting to arduino board ...');
    var pBoard = this.initBoard();
    pBoard.done(function() {
        console.info('[Blender][infos] Board connected successfully');
    });

    var pCart = deferred();
    pBoard.done(function() {
        console.info('[Blender][infos] Initializing cart ...');
        this.initCart().done(function() {
            console.info('[Blender][infos] Cart successfully initialized');
            pCart.resolve();
        });
    }.bind(this));

    var pModules = deferred();
    pBoard.done(function() {
        console.info('[Blender][infos] Loading modules from database ...');
        this.loadModules().done(function() {
            console.info('[Blender][infos] Modules successfully loaded');
            pModules.resolve();
        });
    }.bind(this));

    deferred(pIngredient, pBoard, pModules.promise, pCart.promise)(function(result) {
        console.info('[Blender][infos] Initialisation ended.');
        this.available = true;

        dfd.resolve();
    }.bind(this));

    return dfd.promise;
};

Blender.prototype.updateIngredient = function() {
    var dfd = deferred();

    var http = require('http'),
        VersionModel = require('./model/version'),
        IngredientModel = require('./model/ingredient'),
        body = "",
        result;

    http.get(config.master.url + "/version.json ", function(res) {
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            var result = JSON.parse(body);
            var newVersion = result.version,
                newChecksum = result.checksum;

            // Get current version
            VersionModel.findOne(function(err, post) {
                var id = post._id,
                    currentVersion = post.version,
                    currentChecksum = post.checksum;

                // Blender outdated
                if (parseFloat(newVersion) > parseFloat(currentVersion)) {
                    body = "";
                    // Get ingredients
                    http.get(config.master.url + "/master.json ", function(res) {
                        res.on('data', function(chunk) {
                            body += chunk;
                        });
                        res.on('end', function() {
                            result = JSON.parse(body);

                            for (var i in result.ingredients) {
                                // Save ingredient if not exist
                                IngredientModel.update({
                                    uuid: i
                                }, {
                                    $set: {
                                        name: result.ingredients[i].name
                                    }
                                }, {
                                    upsert: true
                                }).exec();
                            }

                            // Update version
                            VersionModel.update({
                                _id: id
                            }, {
                                $set: {
                                    version: newVersion,
                                    checksum: newChecksum
                                }
                            }).exec();

                            dfd.resolve();
                        })
                    });
                } else {
                    dfd.resolve();
                }
            });
        });
    });

    return dfd.promise;
};

Blender.prototype.initBoard = function() {
    var dfd = deferred();

    if (config.board.debug == true) {
        dfd.resolve();

        return dfd.promise;
    }

    this.board = new Five.Board({
        port: config.board.port
    }).on('ready', function() {
        dfd.resolve();
    });

    return dfd.promise;
};

Blender.prototype.initCart = function() {
    var dfd = deferred();

    this.cart = new Cart(this.board);

    this.cart.init().done(function() {
        dfd.resolve();
    });

    return dfd.promise;
};

Blender.prototype.loadModules = function() {
    var dfd = deferred();

    // Clear modules container
    this.modules = {};

    // Search for modules in database
    ModuleModel.find(function(err, data) {
        for (var key in data) {
            var module = data[key];
            if (module.type && module.order) {
                var moduleName = module.type.charAt(0).toUpperCase() + module.type.slice(1);
                if (!this.modules[moduleName]) this.modules[moduleName] = [];

                this.modules[moduleName].push({
                    model: module
                });
            }
        }

        for (var type in this.modules) {
            var modulesByType = this.modules[type];
            for (var key in modulesByType) {
                var module = modulesByType[key];

                module.controller = new global[type](module.model, this.board);

                if (module.controller.init && typeof module.controller.init == 'function') {
                    module.controller.init();
                }
            }
        }

        dfd.resolve();
    }.bind(this));

    return dfd.promise;
};

Blender.prototype.step = function(steps) {
    var dfd = deferred();

    var step = steps[0];

    if (step.status == 0) {
        var module = step.moduleType;

        console.log('step n°' + step.order);
        console.log('Moving to the module');
        this.cart.moveToModule(step.module.controller).done(function() {
            console.log('Cart moved to module')
            step.module.controller.execute(step.params).done(function() {
                steps = steps.slice(1);

                dfd.resolve(steps);
            });
        });
    } else {
        steps = steps.slice(1);
        dfd.reject();
    }

    return dfd.promise;
};

Blender.prototype.run = function(recipe) {
    var dfd = deferred();

    if (this.isAvailable()) {
        this.available = false;

        this.convert(recipe).done(function(steps) {
            this.step(steps).then(function self(value) {
                if (value.length > 0) {
                    return this.step(value).then(self.bind(this));
                }

                return value;
            }.bind(this)).done(function() {
                console.log('Back to master ...');
                this.cart.moveToMaster().done(function() {
                    console.log('Cart moved to initial position');

                    this.available = true;

                    dfd.resolve();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    } else {
        dfd.reject();
    }

    return dfd.promise;
};

Blender.prototype.convert = function(recipe) {
    var dfd = deferred();

    var moduleStack = [];
    var recipeSteps = [];

    recipe.steps.forEach(function(step) {
        var moduleType = step.action + 'er';
        moduleType = moduleType.charAt(0).toUpperCase() + moduleType.slice(1);

        if (this.modules[moduleType]) {
            var availableModules = global[moduleType].discriminant(
                step.parameters,
                this.modules[moduleType]
            );
            if (availableModules.length > 0) {
                recipeSteps.push({
                    moduleType: moduleType,
                    order: step.order,
                    status: 0,
                    module: availableModules[0],
                    params: step.parameters
                });
            } else {
                recipeSteps.push({
                    order: step.order,
                    status: 1,
                    message: 'ERR_NO_MODULE_AVAILABLE',
                    params: step.parameters
                });
            }
        } else {
            recipeSteps.push({
                moduleType: moduleType,
                order: step.order,
                status: 2,
                message: 'ERR_UNKNOW_ACTION',
                params: step.parameters
            });
        }
    }.bind(this));

    var hasErrors = (recipeSteps.filter(function(data) {
        return (data.status == 1);
    }).length > 0);

    if (hasErrors) {
        dfd.reject(recipeSteps);
    } else {
        dfd.resolve(recipeSteps);
    }

    return dfd.promise;
};

/**
 * Export the blender instance
 * @type {Blender}
 */
exports.Blender = new Blender();