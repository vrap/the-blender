/**
 * Module prototype
 * Abstract class defining module interface
 * @type {Module}
 */
exports.Helper = Helper = function() {};

/**
 * Generate UUID v4
 */
Helper.prototype.generateUuid = function() {
	return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
		this.s4() + '-' + this.s4() + this.s4() + this.s4();
};

Helper.prototype.s4 = function(){
	return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
}