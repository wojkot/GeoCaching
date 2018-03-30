const express = require('express');
const http = require('http');
const path = require('path');
const mongo = require('mongodb');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');

// Routes
const usersFunctions = require('./routes/users');
const safesFunctions = require('./routes/safes');
const discoversFunctions = require('./routes/discovers');

//Schemas
const Users = require('./schemas/users');
const Safes = require('./schemas/safes');
const SafeDiscovers = require('./schemas/discovers');

const app = express();
app.use(express.static(__dirname, { index: './views/index.html' }));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(session({ secret: 'code' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(usersFunctions.validateUser));

mongoose.connect('mongodb://localhost/test16');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

//Patches - uncomment only for testing purposes
const addTestUser = require('./patches/patch_add_user');
app.use(addTestUser.addUser)


app.route('/load')
    .get(safesFunctions.loadSafes)

app.route('/register')
    .get(usersFunctions.register)
    .post(usersFunctions.registerUser);

app.route('/login')
    .post(usersFunctions.authenticator)
    .get(usersFunctions.redirector)

app.route('/safe/save')
    .post(safesFunctions.saveSafe)

app.route('/safe/markdiscovered')
    .post(discoversFunctions.markSafeDiscovered)

app.route('/safe/edit')
    .get(safesFunctions.editSafe)

app.route('/safe/select')
    .get(safesFunctions.selectSafe)

app.route('/safe/remove')
    .delete(safesFunctions.removeSafe)

app.route('/logout')
    .get(usersFunctions.logout)

app.listen('3000', () => {
    console.log('Serwer is listening on port 3000');
});


module.exports = app




