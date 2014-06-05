/**
 * Database configuration
 */

module.exports = {
    database: {
        url: 'mongodb://localhost/the-blender'
    },
	master: {
        url: 'http://localhost:8080/LP-DevWeb/The%20Blender/the-blender-master'
    },
    server: {
        port: 6666
    },
    board: {
        port: '/dev/ttyACM0'
    }
};