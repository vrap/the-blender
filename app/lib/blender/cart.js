var util   = require('util'),
    Module = require('../model/module').Module;
    /*stepper  = new Five.Stepper({
        type: Five.Stepper.TYPE.TWO_WIRE,
        stepsPerRev: 200,
        pins: {
            motor1: 12,
            motor2: 13
        }
    }),
    maxSpeed = 200,
    minSpeed = 20;*/

/**
 * Cart Module prototype
 * @type {Cart}
 */
exports.Cart = Cart = function() {
    Cart.super_.call(this);
};

util.inherits(Cart, Module);

/**
 * Initializing the position of the cart
 */
Cart.prototype.init = function() { 
    /*var pwmA   = new Five.Pin(3).high();
    var pwmB   = new Five.Pin(11).high();
    var brakeA = new Five.Pin(9).low();
    var brakeB = new Five.Pin(8).low();*/

    Module.findOne(function(err, post) {
        console.log(post);
    });


    // Récupérer le 1er module dans MongoDB
    // moveTo ce module pour RAZ

    // var master =

    // this.moveTo(master, maxSpeed);
};

/**
 * Call actuators to move the glass
 * @param {Module} module
 */
Cart.prototype.moveTo = function(module, speed) {
    if (false === module instanceof Module) {
        throw 'Bad parameter instance. Instance of Module expected';
    }

    if (speed == undefined) {
        speed = minSpeed;
    }

    stepper.rpm(speed).direction(Five.Stepper.DIRECTION.CCW).step(stepsPerRev, function() {});

    // actions to move to the expected module.
};
