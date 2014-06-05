var mongoose = require('mongoose');

module.exports = mongoose.model('Module', {
    order: Number,
    content: { type: String, default: null },
    components: [{
        type: String,
        pins: [Number]
    }]
});