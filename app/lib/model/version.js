var mongoose = require('mongoose');

module.exports = mongoose.model('Version', {
    version: Number,
    checksum: String
});