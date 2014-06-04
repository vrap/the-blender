console.log('Initialization start ...');

var mongoose = require('mongoose'),
    database = require('../config/database'),
    Version = require('../app/lib/model/version'),
    Recipe = require('../app/lib/model/recipe'),
    Ingredient = require('../app/lib/model/ingredient');

// Create database
mongoose.connect(database.url);
console.log('Database ' + database.url + ' created.');

// Version table
var v = new Version({
    version: 0,
    checksum: 'init'
});
v.save();
console.log('Table Version created');

// Ingredient table
var ing1 = new Ingredient({
    uuid: "3e2d0d40-05e8-4e23-8c71-f0f62c1f49fe",
    name: "Tequila"
});
var ing2 = new Ingredient({
    uuid: "9705e725-b777-41b6-b957-ce762dec8e3d",
    name: "Brown rum"
});
var ing3 = new Ingredient({
    uuid: "b5df5bc6-1b26-4702-bcbe-73a2709c4e23",
    name: "White rum"
});
ing1.save();
ing2.save();
ing3.save();
console.log('Table Ingredient created');

// Recipe table
var r = new Recipe({
    uuid: "b52d956f-e690-11e3-ad38-dfb1db377fd7",
    name: "Mojito",
    author: "7cc528de-e6bf-11e3-ad38-dfb1db377fd7",
    created: new Date(),
    updated: null,
    forked: null,
    steps: [
        {
            order: 1,
            action: "poor",
            parameters: [
                {
                    name: "ingredient",
                    value: "b52d956f-e690-11e3-ad47-dfb1db377127"
                },
                {
                    name: "dosage",
                    value: 2
                }
            ]
        },
        {
            order: 2,
            action: "poor",
            parameters: [
                {
                    name: "ingredient",
                    value: "b52d956f-e690-a7e3-ad38-dfb1db377f49"
                },
                {
                    name: "dosage",
                    value: 1
                }
            ]
        }
    ]
});
r.save();
console.log('Table Recipe created');

console.log('Initialization done!');