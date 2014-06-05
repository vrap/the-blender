/**
 * Module dependencies.
 */
var Five    = require('johnny-five'),
    config  = require('../config/config'),
    board   = new Five.Board({
        port: '/dev/ttyACM0'
    });

board.on('ready', function() {
    var Server    = require('./lib/server').Server,
        Blender   = require('./lib/blender/blender').Blender,
        Plateau   = require('./lib/blender/plateau').Plateau,
        Pourer    = require('./lib/blender/pourer').Pourer,
        Recipe    = require('./lib/recipe/recipe').Recipe,
        Step      = require('./lib/recipe/step').Step,
        Parameter = require('./lib/recipe/parameter').Parameter,
        mongoose  = require('mongoose'),
        http      = require('http'),
        Version   = require('./lib/version');

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

    // Setting the routes
    require('./lib/routes')(server.app);
});

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
            Version.findOne(function(err, post) {
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
                                Ingredient.update(
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
                            Version.update(
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
