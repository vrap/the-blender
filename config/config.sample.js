/**
 * Database configuration
 */

module.exports = {
    database: {
        url: 'mongodb://localhost:25486/the-blender'
    },
    master: {
        url: 'http://localhost:8080/'
    },
    server: {
        port: 5555
    },
    board: {
        port: '/dev/ttyACM0',
        debug: true,
        cart: {
            A: {
                pwm: 3,
                brake: 9,
                dir: 12
            },
            B: {
                pwm: 11,
                brake: 8,
                dir: 13
            }
        }
    }
};