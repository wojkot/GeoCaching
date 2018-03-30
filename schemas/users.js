var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String
});


module.exports = mongoose.model('Users', userSchema);