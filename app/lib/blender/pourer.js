var util = require('util'),
	Module = require('./module').Module,
    Five    = require('johnny-five');

/**
 * Pourer Module prototype
 * @type {Pourer}
 */
exports.Pourer = Pourer = function () {
	Pourer.super_.call(this);
};
util.inherits(Pourer, Module);

/**
 * Initialization of the pourer
 *
 * @param order
 * @param pin
 * @param board
 */
Pourer.prototype.init = function(order, pin, board) {
	this.order = order;
	this.components = {
        servo: new Five.Servo({
            pin: pin,
            center: true
        }),
        board: board
    };
};

/**
 * Call actuators to pour some liquid
 */
Pourer.prototype.pour = function(pourTime, nbPour) {
	// Actions to pour the liquid
    var posBottom   = 179;

    this.components.servo.to(posBottom);
    this.components.board.wait(nbPour*pourTime, function() {
        this.components.servo.center();
    }.bind(this));
};