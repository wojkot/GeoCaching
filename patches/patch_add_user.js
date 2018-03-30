exports.addUser = function(req, res, next){

    req.user = {
        _id: '5ab3e66975786f2e0851f75d',
        name: 'testuser'
    };

    req.isAuthenticated = function () {
        return true;
    };

    next();
};