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
            accel: 1600,
            decel: 1600
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
            this.sensorState = 1;
        }.bind(this));

        this.sensor.on('down', function() {
            this.sensorState = 0;
        }.bind(this));
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
            this.stepper
                .rpm(this.parameters.clockwise.rpm)
                .accel(this.parameters.clockwise.accel)
                .decel(this.parameters.clockwise.devel)
                .cw();
        }
        console.log('Cart direction : Clockwise');
    } else {
        if (!config.board.debug) {
            this.stepper
                .rpm(this.parameters.counterClockwise.rpm)
                .accel(this.parameters.counterClockwise.accel)
                .decel(this.parameters.counterClockwise.devel)
                .ccw();
        }
        console.log('Cart direction : Counter clockwise');
    }

    if (!config.board.debug) {
        this.stepper
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

Cart.prototype.moveToMaster = function(dfd) {
    if (!dfd) {
        dfd = deferred();
    }

    var diff = 0 - this.position;

    if (diff == 0) {
        dfd.resolve();
    } else if (diff > 0) {
        this.stepper.cw();
    } else {
        this.stepper.ccw();
    }

    this.stepper
        .accel(this.parameters.end.accel)
        .decel(this.parameters.end.devel)
        .rpm(rpm)
        .step(ModuleClass.SIZE, function() {
            if (this.sensorState == 1) {
                this.position = 0;

                dfd.resolve();
            } else {
                setTimeout(function() {
                    this.moveToMaster(dfd);
                }.bind(this), 0);
            }
        }.bind(this));

    return dfd.promise;
};