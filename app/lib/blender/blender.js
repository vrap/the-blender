var mongoose = require('mongoose'),
    Pourer = require('./pourer').Pourer,
    ModuleModel = require('../model/module');

/**
 * Blender prototype
 * @type {Blender}
 */
exports.Blender = Blender = function () {};

/**
 * Initializes the Blender with its modules or set it as an object
 * @param {Array} modules
 */
Blender.prototype.init = function (modules) {
	modules = typeof modules !== 'undefined' ?  this.modules = modules : this.modules = [];
};

/**
 * Execute steps to have a cocktail
 * @param {Array} steps
 */
Blender.prototype.execute = function(steps) {
    for(var i in steps) {
        console.log(steps[i]);
        switch(steps[i].action) {
            case 'poor': console.log('POOR !');
                var ingrUuid,
                    module,
                    pourer = new Pourer(),
                    nbPour;

                for(j in steps[i].parameters) {
                    if(steps[i].parameters[j].name == 'ingredient') {
                        ingrUuid = steps[i].parameters[j].value;
                    }
                    if(steps[i].parameters[j].name == 'dosage') {
                        nbPour = steps[i].parameters[j].value;
                    }
                }

                ModuleModel.findOne({content: ingrUuid}, function(err, data) {
                   pourer.init(data.order);
                });

                break;
        }
    }
};