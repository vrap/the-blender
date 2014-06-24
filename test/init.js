console.log('Initialization start ...');

var mongoose = require('mongoose'),
    config = require('../config/config'),
    Version = require('../app/lib/model/version'),
    Recipe = require('../app/lib/model/recipe'),
    Ingredient = require('../app/lib/model/ingredient'),
    Module = require('../app/lib/model/module');

// Create database
mongoose.connect(config.database.url);
console.log('Database ' + config.database.url + ' created.');

// Dropping the database if already exist
mongoose.connection.db.dropDatabase();

// Version table
var v = new Version({
    version: 0,
    checksum: 'init'
});
v.save();
console.log('Table Version created');

// Recipe table
var r1 = new Recipe({
    uuid: "b52d956f-e690-11e3-ad38-dfb1db377fd7",
    name: "Diabolo grenadine",
    author: "",
    created: new Date(),
    updated: null,
    forked: null,
    steps: [{
        order: 1,
        action: "pour",
        parameters: [{
            name: "ingredient",
            value: "53d9525f-61ac-4990-a045-aa4f17503ce7"
        }, {
            name: "dosage",
            value: 3
        }]
    }, {
        order: 2,
        action: "pour",
        parameters: [{
            name: "ingredient",
            value: "3e2d0d40-05e8-4e23-8c71-f0f62c1f49fe"
        }, {
            name: "dosage",
            value: 8
        }]
    }]
});
var r2 = new Recipe({
    uuid: "b52d956f-e690-11e3-ad38-dfb1db377fd7",
    name: "Vrap grenarhum",
    author: "",
    created: new Date(),
    updated: null,
    forked: null,
    steps: [{
        order: 1,
        action: "pour",
        parameters: [{
            name: "ingredient",
            value: "53d9525f-61ac-4990-a045-aa4f17503ce7"
        }, {
            name: "dosage",
            value: 5
        }]
    }, {
        order: 2,
        action: "pour",
        parameters: [{
            name: "ingredient",
            value: "9146eaeb-32fd-4810-8954-9f396958bdde"
        }, {
            name: "dosage",
            value: 9
        }]
    }]
});
var r3 = new Recipe({
    uuid: "b52d956f-e690-11e3-ad38-dfb1db377fd7",
    name: "Purge",
    author: "",
    created: new Date(),
    updated: null,
    forked: null,
    steps: [{
        order: 1,
        action: "pour",
        parameters: [{
            name: "ingredient",
            value: "3e2d0d40-05e8-4e23-8c71-f0f62c1f49fe"
        }, {
            name: "dosage",
            value: 1
        }]
    }, {
        order: 2,
        action: "pour",
        parameters: [{
            name: "ingredient",
            value: "9146eaeb-32fd-4810-8954-9f396958bdde"
        }, {
            name: "dosage",
            value: 1
        }]
    }, {
        order: 3,
        action: "pour",
        parameters: [{
            name: "ingredient",
            value: "53d9525f-61ac-4990-a045-aa4f17503ce7"
        }, {
            name: "dosage",
            value: 1
        }]
    }]
});
var r4 = new Recipe({
    uuid: "b52d956f-e690-11e3-ad38-dfb1db377fd7",
    name: "Vrap Mojito",
    author: "",
    created: new Date(),
    updated: null,
    forked: null,
    steps: [{
        order: 1,
        action: "pour",
        parameters: [{
            name: "ingredient",
            value: "9146eaeb-32fd-4810-8954-9f396958bdde"
        }, {
            name: "dosage",
            value: 3
        }]
    }, {
        order: 2,
        action: "pour",
        parameters: [{
            name: "ingredient",
            value: "3e2d0d40-05e8-4e23-8c71-f0f62c1f49fe"
        }, {
            name: "dosage",
            value: 12
        }]
    }]
});
var r5 = new Recipe({
    uuid: "b52d956f-e690-11e3-ad38-dfb1db377fd8",
    name: "Vrap Test",
    author: "",
    created: new Date(),
    updated: null,
    forked: null,
    steps: [{
        order: 1,
        action: "pour",
        parameters: [{
            name: "ingredient",
            value: "9146eaeb-32fd-4810-8954-9f396958bdde"
        }, {
            name: "dosage",
            value: 1
        }]
    }]
});
r5.save();
r4.save();
r3.save();
r2.save();
r1.save();
console.log('Table Recipe created');

// Module table
var m1 = new Module({
    order: 1,
    type: "pourer",
    content: "9146eaeb-32fd-4810-8954-9f396958bdde",
    components: [{
        class: "valve",
        address: [4]
    }]
});
var m2 = new Module({
    order: 2,
    type: "pourer",
    content: "3e2d0d40-05e8-4e23-8c71-f0f62c1f49fe",
    components: [{
        class: "valve",
        address: [5]
    }]
});
var m3 = new Module({
    order: 3,
    type: "pourer",
    content: "53d9525f-61ac-4990-a045-aa4f17503ce7",
    components: [{
        class: "valve",
        address: [6]
    }]
});
m1.save();
m2.save();
m3.save();
console.log('Table Module created');
console.log('Initialization done!');