let mongoose = require('mongoose');
let Users = require('../schemas/users');
let Safes = require('../schemas/safes');
let SafeDiscovers = require('../schemas/discovers');


exports.markSafeDiscovered = async function markSafeDiscovered(req, res) {
    try {
        const { discoveredSafeId, discovered } = req.body;
        let success = false;
        if (discovered) {
            const safeDiscover = new SafeDiscovers({ userId: req.user._id, username: req.user.name, safeId: discoveredSafeId });
            const save = await safeDiscover.save();
            success = (save._id !== null) ? true : false;
        }
        else {
            const remove = await SafeDiscovers.find({ safeId: discoveredSafeId, userId: req.user._id }).remove().exec();
            success = (remove.ok > 0) ? true : false;
        }

        res.json({
            success: success,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Something broke!')
    }

};

