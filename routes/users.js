const crypto = require('crypto');
const mongoose = require('mongoose');
const Users = require('../schemas/users');
const path = require('path');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy



exports.validateUser = function validateUser(username, password, done) {
    try {
        const hashPassword = crypto.createHmac('sha256', password).digest('hex');
        const result = Users.findOne({ 'name': username, 'password': hashPassword }, function (err, user) {
            return done(null, user);
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Something broke!')
    }
}

exports.registerUser = async function registerUser(req, res) {
    try {
        const { userName, userEmail, userPassword } = req.body;
        const hashPassword = crypto.createHmac('sha256', userPassword).digest('hex');
        const user = new Users({ name: userName, password: hashPassword, email: userEmail });
        await user.save()

        res.json({
            id: user._id,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Something broke!')
    }
};

exports.register = function (req, res) {
    try {
        res.sendFile(path.join(__dirname + '/../views/register.html'));
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Something broke!')
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
        res.status(500).send('Something broke!')
    }
};


exports.logout = function (req, res) {
    req.logout();
    res.redirect('./login');
};

