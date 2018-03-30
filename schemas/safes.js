var mongoose = require('mongoose');

let safeSchema = mongoose.Schema({
    name: String,
    description: String,
    owner: String,
    localization: String,
    lattitude: Number,
    longitude: Number,
    discovers: String
});


module.exports = mongoose.model('Safes', safeSchema);