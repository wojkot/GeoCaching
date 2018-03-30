var mongoose = require('mongoose');

let safeDiscoversSchema = mongoose.Schema({
    userId: String,
    username: String,
    safeId: String
});

module.exports = mongoose.model('SafeDiscovers', safeDiscoversSchema);