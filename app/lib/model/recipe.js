var mongoose = require('mongoose');

module.exports = mongoose.model('Recipe', {
    uuid: String,
    name: String,
    author: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: null },
    forked: { type: String, default: null },
    steps: [{
        order: Number,
        action: String,
        parameters: [{
            name: String,
            value: mongoose.Schema.Types.Mixed
        }]
    }]
});