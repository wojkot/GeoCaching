let mongoose = require('mongoose');
let Safes = require('../schemas/safes');
let Users = require('../schemas/users');
let SafeDiscovers = require('../schemas/discovers');

exports.loadSafes = async function loadSafes(req, res) {

    try {
        const loggedIn = (req.user === undefined) ? null : req.user;
        const safes = await Safes.find({});
        let discovers = new SafeDiscovers();
        let owner = new Users();

        if (safes.length !== 0) {
            discovers = await SafeDiscovers.find({ safeId: safes[0]._id }, 'username userId').exec();
            owner = await Users.findOne({ _id: safes[0].owner }, 'name').exec() || new Users();
        }

        res.json({
            safes: safes,
            discovers: discovers,
            loggedIn: loggedIn,
            owner: owner,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Something broke!')
    }
};


exports.addSafe = async function saveSafe(req, res) {
    try {
        const { safeName, safeDescription, safeLocalization, safeLattitude, safeLongitude } = req.body;
        let safe = {};

        safe = new Safes({
            name: safeName, description: safeDescription, owner: req.user._id,
            localization: safeLocalization, lattitude: safeLattitude, longitude: safeLongitude
        });

        await safe.save();

        res.json({
            id: safe._id,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Something broke!')
    }
};


exports.saveSafe = async function saveSafe(req, res) {
    try {
        const { safeId, safeName, safeDescription, safeLocalization, safeLattitude, safeLongitude } = req.body;

        let safe = await Safes.findById(safeId);
        if (safe === null) {
            throw "Cannot update safe!";
        }

        safe.name = safeName;
        safe.description = safeDescription;
        safe.localization = safeLocalization;
        safe.lattitude = safeLattitude;
        safe.longitude = safeLongitude;

        await safe.save();

        res.json({
            id: safe._id,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Something broke!')
    }
};


exports.editSafe = async function editSafe(req, res) {
   
    try {
        const { editSafeId } = req.query;
        let safe = await Safes.findById(editSafeId, 'name description localization lattitude longitude')

        if (safe === null) {
            throw "Cannot find safe!";
        }

        res.json({
            safe: safe,
        });

    }
    catch (err) {
        console.log(err);
        res.status(500).send('Something broke!')
    }
};


exports.selectSafe = async function selectSafe(req, res) {

    try {

        const { selectedSafeId } = req.query;
        const loggedIn = (req.user === undefined) ? null : req.user;
        const safe = await Safes.findById(selectedSafeId) || new Safes();
        const discovers = await SafeDiscovers.find({ safeId: safe._id }, 'username userId') || new Discovers();
        const owner = await Users.findOne({ _id: safe.owner }, 'name') || new Users();

        res.json({
            safe: safe,
            discovers: discovers,
            loggedIn: loggedIn,
            owner: owner,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Something broke!')
    }
};

exports.removeSafe = async function removeSafe(req, res) {
    try {
        const { removedSafeId } = req.body;
        const { n, ok } = await Safes.find({ _id: removedSafeId }).remove().exec();

        res.json({
            operations: n,
            status: ok,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Something broke!')
    }
};
