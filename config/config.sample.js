/**
 * Database configuration
 */

module.exports = {
    database: {
        url: 'mongodb://localhost:27017/the-blender'
    },
    master: {
        url: 'http://library.the-blender.io/'
    },
    server: {
        port: 80
    },
    board: {
        port: '/dev/ttyACM0',
        debug: false,
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