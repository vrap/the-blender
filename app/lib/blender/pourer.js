var util = require('util'),
	Module = require('./module').Module;

/**
 * Pourer Module prototype
 * @type {Pourer}
 */
exports.Pourer = Pourer = function(order, components, liquid) {
	Pourer.super_.call(this);

	this.order = order;
	this.components = components;
	this.liquid = liquid;
};
util.inherits(Pourer, Module);

/**
 * Call actuators to pour some liquid
 */
Pourer.prototype.pour = function() {
	// Actions to pour the liquid
};