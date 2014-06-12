var config = require('../../config/config'),
    Five = require('johnny-five'),
    deferred = require('deferred'),
    ModuleClass = require('./module/module').Module,
    ModuleModel = require('./model/module');

/**
 * Cart Module prototype
 * @type {Cart}
 */
exports.Cart = Cart = function(board) {
    if (!(board instanceof Five.Board) && config.board.debug != true) {
        throw new Exception('Cart need an instance of Johnny Five Board to be load');
    }

    this.board = board;
    this.position = 0;
};

/**
 * Initializing the position of the cart
 */
Cart.prototype.init = function() {
    var dfd = deferred();
    var cartConfig = config.board.cart;

    if (config.board.debug != true) {
        this.pins = {
            A: {
                pwm: new Five.Pin(cartConfig.A.pwm),
                brake: new Five.Pin(cartConfig.A.brake),
            },
            B: {
                pwm: new Five.Pin(cartConfig.B.pwm),
                brake: new Five.Pin(cartConfig.B.brake),
            }
        }

        this.pins.A.pwm.high();
        this.pins.A.brake.low();

        this.pins.B.pwm.high();
        this.pins.B.brake.low();

        this.stepper = new Five.Stepper({
            type: Five.Stepper.TYPE.TWO_WIRE,
            stepsPerRev: 200,
            pins: {
                motor1: cartConfig.A.dir,
                motor2: cartConfig.B.dir
            }
        });

    }

    dfd.resolve();

    return dfd.promise;
};

Cart.prototype.moveTo = function(step) {
    var dfd = deferred(),
        diff = step - this.position;

    if (diff == 0) {
        dfd.resolve();
        console.log('Cart is already at the good position');
    } else if (diff > 0) {
        if (!config.board.debug) {
            this.stepper.direction(Five.Stepper.DIRECTION.CW);
        }
        console.log('Cart direction : Clockwise');
    } else {
        if (!config.board.debug) {
            this.stepper.direction(Five.Stepper.DIRECTION.CCW);
        }
        console.log('Cart direction : Counter clockwise');
    }

    if (!config.board.debug) {
        this.stepper
            .rpm(180)
            .step(Math.abs(diff), function() {
                this.position += diff;

                dfd.resolve();
            }.bind(this));
    } else {
        this.position += diff;
        dfd.resolve();
    }

    console.log('Moved to ' + this.position);

    return dfd.promise;
};

/**
 * Call actuators to move the glass
 * @param {Module} module
 */
Cart.prototype.moveToModule = function(module) {
    var dfd = deferred();

    if (false === module instanceof Module) {
        throw 'Bad parameter instance. Instance of Module expected';
    }

    this.moveTo((module.order * ModuleClass.SIZE)).done(function() {
        dfd.resolve();
    });

    return dfd.promise;
};