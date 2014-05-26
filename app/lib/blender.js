/**
 * Blender prototype
 * @type {Blender}
 */
exports.Blender = Blender = function () {};

/**
 * Initializes the Blender with its modules or set it as an array
 * @param {Object} modules
 */
Blender.prototype.init = function(modules) {
	modules = typeof modules !== 'undefined' ?  this.modules = modules : this.modules = {};
};