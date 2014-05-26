var util = require('util'),
	Module = require('./module').Module;

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
 * @param components
 * @param liquid
 */
Pourer.prototype.init = function(order, components, liquid) {
	this.order = order;
	this.components = components;
	this.liquid = liquid;
};

/**
 * Call actuators to pour some liquid
 */
Pourer.prototype.pour = function() {
	// Actions to pour the liquid
};