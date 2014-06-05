// var util    = require('util'),
//     Module  = require('./module').Module,
//     stepper = new Five.Stepper({
//         type: Five.Stepper.TYPE.TWO_WIRE,
//         stepsPerRev: 200,
//         pins: {
//             motor1: 12,
//             motor2: 13
//         }
//     }),
//     maxSpeed = 200,
//     minSpeed = 20;

// /**
//  * Plateau Module prototype
//  * @type {Plateau}
//  */
// exports.Plateau = Plateau = function() {
//     Plateau.super_.call(this);
// };

// util.inherits(Plateau, Module);

// /**
//  * Initializing the position of the plateau
//  */
// Plateau.prototype.init = function() { 
//     var pwmA   = new Five.Pin(3).high();
//     var pwmB   = new Five.Pin(11).high();
//     var brakeA = new Five.Pin(9).low();
//     var brakeB = new Five.Pin(8).low();

//     // Récupérer le 1er module dans MongoDB
//     // moveTo ce module pour RAZ

//     // var master =

//     this.moveTo(master, maxSpeed);
// };

// /**
//  * Call actuators to move the glass
//  * @param {Module} module
//  */
// Plateau.prototype.moveTo = function(module, speed) {
//     if (false === module instanceof Module) {
//         throw 'Bad parameter instance. Instance of Module expected';
//     }

//     if (speed == undefined) {
//         speed = minSpeed;
//     }

//     stepper.rpm(speed).direction(Five.Stepper.DIRECTION.CCW).step(stepsPerRev, function() {});

//     // actions to move to the expected module.
// };
