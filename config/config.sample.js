/**
 * The blender configuration sample file.
 *
 * This file is a sample, copy it to config.js and adapt it to your needs.
 * You can remove comments if you want a cleaner configuration file.
 */

module.exports = {
    /**
     * Database configuration
     * @type {Object}
     */
    database: {
        /**
         * URL is the url of the mongodb database
         * @type {String}
         */
        url: 'mongodb://localhost:27017/the-blender'
    },
    /**
     * Master configuration
     * @type {Object}
     */
    master: {
        /**
         * URL is the url of the ingredient library API. For compatibility
         * purpose we dot not recommand to change this value.
         * @type {String}
         */
        url: 'http://library.the-blender.io/'
    },
    /**
     * Server configuration related to the web application controlling the
     * blender.
     * @type {Object}
     */
    server: {
        /**
         * Listened port by the web application.
         * @type {Number}
         */
        port: 80
    },
    /**
     * This section let you configure the arduino board.
     * @type {Object}
     */
    board: {
        /**
         * Serial port used to communicate with the arduino.
         * @type {String}
         */
        port: '/dev/ttyACM0',
        /**
         * The debug option let you simulate the arduino board for test purpose
         * instead of connecting it when set to true.
         *
         * Used for developpement.
         *
         * @type {Boolean}
         */
        debug: false,
        /**
         * The cart section let you configure options about the cart that drive
         * the glass between modules. The cart is composed of a two wire Stepper
         * motor with two motors. You need to define the pins of each motors
         * regarding the documentation of the stepper used. The configuration
         * defined below is good for a stepper like the one recommanded in the
         * documentation.
         *
         * @type {Object}
         */
        cart: {
            /**
             * Motor A configuration
             * @type {Object}
             */
            A: {
                /**
                 * The "Pwm" pin
                 * @type {Number}
                 */
                pwm: 3,
                /**
                 * The "Brake" pin
                 * @type {Number}
                 */
                brake: 9,
                /**
                 * The "Dir" pin
                 * @type {Number}
                 */
                dir: 12
            },
            /**
             * Motor B configuration
             * @type {Object}
             */
            B: {
                /**
                 * The "Pwm" pin
                 * @type {Number}
                 */
                pwm: 11,
                /**
                 * The "Brake" pin
                 * @type {Number}
                 */
                brake: 8,
                /**
                 * The "Dir" pin
                 * @type {Number}
                 */
                dir: 13
            }
        }
    }
};