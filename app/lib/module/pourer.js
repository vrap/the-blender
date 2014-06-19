var config = require('../../../config/config'),
    util = require('util'),
    Module = require('./module').Module,
    ModuleModel = require('../model/module'),
    deferred = require('deferred'),
    Five = require('johnny-five');

/**
 * Pourer Module prototype
 * @type {Pourer}
 */
exports.Pourer = Pourer = function(model, board) {
    Pourer.super_.apply(this, arguments);

    if (!(model instanceof ModuleModel)) {
        throw new Exception('Module need a model to be load');
    }

    if (!(board instanceof Five.Board) && config.board.debug != true) {
        throw new Exception('Module need an instance of Johnny Five Board to be load');
    }

    this.model = model;
    this.board = board;

};
util.inherits(Pourer, Module);

Pourer.pourTime = 6000;

/**
 * Initialization of the pourer
 *
 * @param order
 * @param pin
 * @param board
 */
Pourer.prototype.init = function() {
    this.order = this.model.order;

    if (config.board.debug != true) {
        this.components = {
            servo: new Five.Servo({
                pin: this.model.components[0].address[0],
                center: true
            })
        };
    }
};

Pourer.prototype.execute = function(params) {
    var dfd = deferred();

    var dosage = params.filter(function(data) {
        return (data.name == 'dosage');
    })[0];

    this.pour(Pourer.pourTime, dosage.value).done(function() {
        dfd.resolve();
    });

    return dfd.promise();
};

/**
 * Call actuators to pour some liquid
 */
Pourer.prototype.pour = function(pourTime, nbPour) {
    var dfd = deferred();

    if (config.board.debug == true) {
        console.log('Pouring in progress ...');
        setTimeout(function() {
            dfd.resolve();
        }, nbPour * pourTime);
    } else {
        // Actions to pour the liquid
        var posBottom = 1;

        this.components.servo.to(posBottom);
        this.board.wait(nbPour * pourTime, function() {
            this.components.servo.center();

            this.board.wait(500, function() {
                dfd.resolve();
            });
        }.bind(this));
    }

    return dfd.promise();
};

Pourer.discriminant = function(params, instances) {
    var ingredient = params.filter(function(data) {
        return (data.name == 'ingredient');
    })[0];

    return instances.filter(function(pourer) {
        return pourer.model.content == ingredient.value;
    });
};