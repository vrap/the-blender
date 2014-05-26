var util = require('util'),
	Module = require('./module').Module;

/**
 * Master Module prototype
 * @type {Master}
 */
exports.Master = Master = function () {
	Master.super_.call(this);
};
util.inherits(Master, Module);

/**
 * Initialization of the master
 * @param components
 */
Master.prototype.init = function (components) {
	this.order = 0; // 0 because the master is the first module
	this.components = components;
};

/**
 * Call actuators to move the glass
 * @param {Module} module
 */
Master.prototype.moveTo = function (module) {
	if(false === module instanceof  Module) {
		throw 'Bad parameter instance. Instance of Module expected';
	}

	// actions to move to the expected module.
};
