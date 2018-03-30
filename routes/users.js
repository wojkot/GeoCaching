const mongoose = require('mongoose');
const Users = require('../schemas/users');
const path = require('path');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy



exports.validateUser = function validateUser(username, password, done) {
    try {
        const result = Users.findOne({ 'name': username, 'password': password }, function (err, user) {
            return done(null, user);
        });
    }
    catch (err) {
        console.log(err);
    }
}

exports.registerUser = async function registerUser(req, res) {
    try {
        const { userName, userEmail, userPassword } = req.body;
        const user = new Users({ name: userName, password: userPassword, email: userEmail });
        await user.save()

        res.json({
            id: user._id,
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.register = function (req, res) {
    try {
        res.sendFile(path.join(__dirname + '/../views/register.html'));
    }
    catch (err) {
        console.log(err);
    }
}

exports.authenticator = passport.authenticate('local', {
    successRedirect: './',
    failureRedirect: './login',
});


exports.redirector = function (req, res) {
    try {
        res.sendFile(path.join(__dirname + '/../views/login.html'))
    }
    catch (err) {
        console.log(err);
    }
};


exports.logout = function (req, res) {
    req.logout();
    res.redirect('./login');
};

