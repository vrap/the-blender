/**
 * Module dependencies.
 */

var Five  = require('johnny-five'),
    board = new Five.Board({
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
        database  = require('../config/database'),
        Version   = require('./lib/version');

    var masterUri = "http://localhost:8080/LP-DevWeb/The%20Blender/the-blender-master";

    // Instanciate the server.
    var server = new Server();

    // Start the server.
    server.init(6666);

    // Connecting to database
    mongoose.connect(database.url);
    var db = mongoose.connection;

    // Check if the blender is up-to-date
    if(checkVersion()) {
        // Have to be updated
    }

    // Setting the routes
    require('./lib/routes')(server.app);
});

/**
 * Check if an update have to be done
 *
 * @return {Boolean} True if the blender have to be updated
 */
function checkVersion() {
    var body = "",
        res,
        current;

    http.get(masterUri + "/version.json", function(res) {
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var res = JSON.parse(body);
            Version.findOne(function(err, post) {
                current = post.version;

                return parseFloat(res.version) > parseFloat(current);
            });
        });
    });
}