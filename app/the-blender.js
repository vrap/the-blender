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
    mongoose = require('mongoose'),
    http = require('http'),
	database = require('../config/database'),
    Version = require('./lib/model/version'),
    Ingredient = require('./lib/model/ingredient');

var masterUri = "http://localhost:8080/LP-DevWeb/The%20Blender/the-blender-master";

// Instanciate the server.
var server = new Server();

// Start the server.
server.init(5555);

// Connecting to database
mongoose.connect(database.url);
var db = mongoose.connection;

// Check if the blender is up-to-date
update();

// Setting the routes
require('./lib/routes')(server.app);

/**
 * Check if an update have to be done
 */
function update() {
    var body = "",
        result;

    http.get(masterUri + "/version.json", function(res) {
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
                    http.get(masterUri + "/master.json", function(res) {
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