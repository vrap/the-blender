/**
 * Module dependencies.
 */

var Five    = require('johnny-five'),
    config  = require('../config/config'),
    VersionModel   = require('./lib/model/version'),
    IngredientModel   = require('./lib/model/ingredient');
    // board   = new Five.Board({
    //     port: config.board.port
    // });

//board.on('ready', function() {
    var Server    = require('./lib/server').Server,
        Blender   = require('./lib/blender/blender').Blender,
        Cart      = require('./lib/blender/cart').Cart,
        Pourer    = require('./lib/blender/pourer').Pourer,
        Recipe    = require('./lib/recipe/recipe').Recipe,
        Step      = require('./lib/recipe/step').Step,
        Parameter = require('./lib/recipe/parameter').Parameter,
        mongoose  = require('mongoose'),
        http      = require('http');

    // Instanciate the server.
    var server = new Server();

    // Start the server.
    server.init(config.server.port);

    // Connecting to database
    mongoose.connect(config.database.url);
    var db = mongoose.connection;

    // Check if the blender is up-to-date
    if(null !== config.master.url) {
        update();
    } else {
        console.log("Cannot update ingredients. Master url don't given.");
    }

    return;

    // Setting the routes
    require('./lib/routes')(server.app);

    // console.log(Cart);
    var cart = new Cart();
    cart.init();
//});

/**
 * Check if an update have to be done
 */
function update() {
    var body = "",
        result;

    http.get(config.master.url + "/version.json", function(res) {
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var result = JSON.parse(body);
            var newVersion = result.version,
                newChecksum = result.checksum;

            // Get current version
            VersionModel.findOne(function(err, post) {
                var id = post._id,
                    currentVersion = post.version,
                    currentChecksum = post.checksum;

                // Blender outdated
                if(parseFloat(newVersion) > parseFloat(currentVersion)) {
                    body = "";
                    // Get ingredients
                    http.get(config.master.url + "/master.json", function(res) {
                        res.on('data', function (chunk) {
                            body += chunk;
                        });
                        res.on('end', function () {
                            result = JSON.parse(body);

                            for(var i in result.ingredients) {
                                // Save ingredient if not exist
                                IngredientModel.update(
                                    {uuid: i},
                                    { $set: {
                                            name: result.ingredients[i].name
                                        }
                                    },
                                    {
                                        upsert: true
                                    }
                                ).exec();
                            }

                            // Update version
                            VersionModel.update(
                                {_id: id},
                                { $set: {
                                    version: newVersion,
                                    checksum: newChecksum
                                }
                                }).exec();
                        })
                    });
                }
            });
        });
    });
}
