var mongoose = require('mongoose');

module.exports = mongoose.model('Ingredient', {
    uuid: String,
    name: String,
});