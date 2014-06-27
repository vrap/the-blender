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

    this.parameters = {
        counterClockwise: {
            rpm: 100,
            accel: 1600,
            decel: 1600
        },
        clockwise: {
            rpm: 100,
            accel: 1600,
            decel: 1600
        },
        end: {
            rpm: 100,
            accel: 0,
            decel: 0
        }
    };
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
            },
            sensor: config.board.sensor
        }

        this.sensorStates = {
            actual: 0,
            old: 1
        };

        this.lockedCart = false;

        this.pins.A.pwm.high();
        this.pins.A.brake.low();

        this.pins.B.pwm.high();
        this.pins.B.brake.low();

        this.stepper = new Five.Stepper({
            type: Five.Stepper.TYPE.TWO_WIRE,
            stepsPerRev: cartConfig.stepsPerRev,
            pins: {
                motor1: cartConfig.A.dir,
                motor2: cartConfig.B.dir
            }
        });

        this.sensor = new Five.Button({
            pin: this.pins.sensor,
            isPullup: true
        });

        this.sensor.on('up', function() {
            this.sensorStates.old = this.sensorStates.actual;
            this.sensorStates.actual = 1;
        }.bind(this));

        this.sensor.on('down', function() {
            this.sensorStates.old = this.sensorStates.actual;
            this.sensorStates.actual = 0;

            this.lockedCart = false;
        }.bind(this));
    }

    dfd.resolve();

    return dfd.promise;
};

Cart.prototype.moveTo = function(destination, dfd) {
    var steps = 10;

    if (!dfd) {
        dfd = deferred();
    }

    var diff = destination - this.position;

    if (diff == 0) {
        dfd.resolve();
    } else if (diff > 0) {
        if (!config.board.debug && this.stepper.direction() !== Five.Stepper.DIRECTION.CW) {
            this.stepper.cw();
        }
    } else {
        if (!config.board.debug && this.stepper.direction() !== Five.Stepper.DIRECTION.CCW) {
            this.stepper.ccw();
        }
    }

    if (!config.board.debug) {
        this.stepper
            .accel(this.parameters.end.accel)
            .decel(this.parameters.end.decel)
            .rpm(this.parameters.end.rpm)
            .step(steps, function() {

                console.log(this.sensorStates.actual);

                if (this.sensorStates.actual == 1 && this.sensorStates.old == 0 && this.lockedCart == false) {
                    this.lockedCart = true;
                    this.position += (diff > 0) ? 1 : -1;

                    if (this.position == destination) {
                        dfd.resolve();

                        return;
                    }
                }

                setTimeout(function() {
                    this.moveTo(destination, dfd);
                }.bind(this), 0);
            }.bind(this));
    } else {
        this.position = destination;
        dfd.resolve();
    }

    return dfd.promise;
};

/**
 * Call actuators to move the glass
 * @param {Module} module
 */
Cart.prototype.moveToModule = function(module) {
    if (false === module instanceof Module) {
        throw 'Bad parameter instance. Instance of Module expected';
    }

    return this.moveTo(module.order);
};

Cart.prototype.moveToMaster = function(dfd) {
    return this.moveTo(0);
};
