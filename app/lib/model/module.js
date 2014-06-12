var mongoose = require('mongoose');

module.exports = mongoose.model('Module', {
    order: Number,
    content: {
        type: String,
        default: null
    },
    type: String,
    components: [{
        class: String,
        address: [Number]
    }]
});