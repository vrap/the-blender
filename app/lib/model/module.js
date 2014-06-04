var mongoose = require('mongoose');

module.exports = mongoose.model('Module', {
    order: Number,
    components: [{
        type: String,
        pins: [Number]
    }]
});