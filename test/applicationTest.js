// Database
const mongoose = require("mongoose");

//Schemasff
const Users = require('../schemas/users');
const Safes = require('../schemas/safes');
const SafeDiscovers = require('../schemas/discovers');

const chai = require('chai');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const should = chai.should();
const server = require('../app');
chai.use(chaiHttp);
request = require("supertest");
agent = request.agent(server);


chai.use(require('chai-passport-strategy'));

describe('1.Remove existing safe - success', () => {

    before(function (done) {
        //Remove safe for tests if it already exists
        Safes.find({ _id: '5ab58d002d237847c8e1b128' }).remove().exec(done);
    });

    before(function (done) {
        //Create new safe
        let safeTest = new Safes({
            _id: '5ab58d002d237847c8e1b128',
            name: 'safeName',
            description: 'safeDescription',
            owner: '',
            localization: 'safeLocalization',
            lattitude: '9',
            longitude: '9',
            discovers: ''
        });
        safeTest.save(done)
    });


    describe('Remove safe', () => {
        it('it should remove one safe with id = 5ab58d002d237847c8e1b128', (done) => {
            let safe = { removedSafeId: '5ab58d002d237847c8e1b128' };
            chai.request(server)
                .delete('/safe/remove')
                .send(safe)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({ status: 1, operations: 1 });
                    done();
                });
        });
    });


});

describe('2.Try to remove no existing safe - fail', () => {

    before(function (done) {
        //Remove safe for tests if it already exists
        Safes.find({ _id: '5ab58d002d237847c8e1b119' }).remove().exec(done);
    });

    describe('/Remove safe', () => {
        it('it should not remove one safe with id = 5ab58d002d237847c8e1b119, because it not exists', (done) => {
            let safe = { removedSafeId: '5ab58d002d237847c8e1b119' };
            chai.request(server)
                .delete('/safe/remove')
                .send(safe)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.eql({ status: 1, operations: 0 });
                    done();
                });
        });
    });
});

describe('3.Add safe', () => {


    it('it should add new safe to database', (done) => {

        let safe = { safeId: null, safeName: 'testSafe', safeDescription: 'testDescription', safeLocalization: 'testLocalization', safeLattitude: '5', safeLongitude: '5' };
        chai.request(server)
            .post('/safe/save')
            .send(safe)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('id');
                done();
            });
    });

    after(function (done) {
        //Restore - remove updated safe
        Safes.find({ name: 'testSafe' }).remove().exec(done);
    });
});


describe('4.Update existing safe safe', () => {

    before(function (done) {
        //Remove safe for tests if it already exists
        Safes.find({ _id: '5ab58d002d237847c8e1b129' }).remove().exec(done);
    });

    before(function (done) {
        //Create new safe
        let safeTest = new Safes({
            _id: '5ab58d002d237847c8e1b129',
            name: 'safeName',
            description: 'safeDescription',
            owner: '',
            localization: 'safeLocalization',
            lattitude: '9',
            longitude: '9',
            discovers: ''
        });
        safeTest.save(done)
    });

    describe('Update safe', function () {
        it('it should update existing safe in database', (done) => {
            let safe = { safeId: '5ab58d002d237847c8e1b129', safeName: 'testSafeEdit', safeDescription: 'test', safeLocalization: 'test', safeLattitude: '5', safeLongitude: '5' };
            chai.request(server)
                .post('/safe/save')
                .send(safe)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.eql(({ id: '5ab58d002d237847c8e1b129' }));
                    done();
                });

        });
    });


    after(function (done) {
        //Restore - remove updated safe
        Safes.find({ _id: '5ab58d002d237847c8e1b129' }).remove().exec(done);
    });

});


describe('5.Edit existing safe safe', () => {

    before(function (done) {
        //Remove safe for tests if it already exists
        Safes.find({ _id: '5ab58d002d237847c8e1b129' }).remove().exec(done);
    });

    before(function (done) {
        //Create new safe
        let safeTest = new Safes({
            _id: '5ab58d002d237847c8e1b129',
            name: 'safeName',
            description: 'safeDescription',
            owner: '',
            localization: 'safeLocalization',
            lattitude: 9,
            longitude: 7,
            discovers: ''
        });
        safeTest.save(done)
    });

    describe('Get actual safe data', function () {
        it('it should all safes data to edit', (done) => {
            let safe = { editSafeId: '5ab58d002d237847c8e1b129' };
            chai.request(server)
                .get('/safe/edit')
                .query(safe)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.safe._id.should.equal('5ab58d002d237847c8e1b129');
                    res.body.safe.description.should.equal('safeDescription');
                    res.body.safe.localization.should.equal('safeLocalization');
                    res.body.safe.lattitude.should.equal(9);
                    res.body.safe.longitude.should.equal(7);
                    done();
                });
        });
    });

    after(function (done) {
        //Restore - remove updated safe
        Safes.find({ _id: '5ab58d002d237847c8e1b129' }).remove();
        return done();
    });
});


describe('6.Try to edit no existing safe - fail', () => {

    it('it should return empty safe with no data except id', (done) => {
        let safe = { editSafeId: '5ab58d002d237847c8e1b1w0' };
        chai.request(server)
            .get('/safe/edit')
            .query(safe)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.safe.should.have.property('_id');
                res.body.safe.name.should.equal('');
                res.body.safe.description.should.equal('');
                res.body.safe.localization.should.equal('');
                res.body.safe.lattitude.should.equal(0);
                res.body.safe.longitude.should.equal(0);
                res.body.safe.owner.should.equal('');
                done();
            });
    });

});



describe('7.Select safe from list and get all its data', () => {

    before(function (done) {
        //Remove safe for tests if it already exists
        Safes.find({ _id: '5ab58d002d237847c8e1b129' }).remove().exec(done);
    });

    before(function (done) {
        //Create new safe
        let safeTest = new Safes({
            _id: '5ab58d002d237847c8e1b129',
            name: 'safeName',
            description: 'safeDescription',
            owner: '5ab3e66975786f2e0851f72d',
            localization: 'safeLocalization',
            lattitude: 9,
            longitude: 7,
        });
        safeTest.save(done)
    });

    before(function (done) {
        //Remove discover for tests if it already exists
        SafeDiscovers.find({ _id: '5ab3e66975786f2e0851f73d' }).remove().exec(done);
    });

    before(function (done) {
        //Create new safe discovery and assign it . Discover name and id is set in test patch.
        let discovery = new SafeDiscovers({
            _id: '5ab3e66975786f2e0851f73d',
            userId: '5ab3e66975786f2e0851f75d',
            username: 'testuser',
            safeId: '5ab58d002d237847c8e1b129'
        });
        discovery.save(done)
    });

    before(function (done) {
        //Remove user for tests if it already exists
        Users.find({ _id: '5ab3e66975786f2e0851f72d' }).remove().exec(done);
    });

    before(function (done) {
        //Create new safe owner and assign it 
        let user = new Users({
            _id: '5ab3e66975786f2e0851f72d',
            name: 'user1',
            password: "123"
        });
        user.save(done)
    });


    describe('Select created safe', () => {
        it('it should get all data of created safe including iscovers and created user as owner', (done) => {

            let safe = { selectedSafeId: '5ab58d002d237847c8e1b129' };
            chai.request(server)
                .get('/safe/select')
                .query(safe)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('discovers');
                    res.body.should.have.property('loggedIn');
                    res.body.should.have.property('safe');
                    res.body.should.have.property('owner');
                    res.body.safe.should.have.property('_id');
                    res.body.safe.name.should.equal('safeName');
                    res.body.safe.description.should.equal('safeDescription');
                    res.body.safe.owner.should.equal('5ab3e66975786f2e0851f72d');
                    res.body.safe.localization.should.equal('safeLocalization');
                    res.body.safe.lattitude.should.equal(9);
                    res.body.safe.longitude.should.equal(7);
                    res.body.owner.should.have.property('_id');
                    res.body.owner.name.should.equal('user1');
                    res.body.discovers[0].should.have.property('_id');
                    res.body.discovers[0].userId.should.be.equal('5ab3e66975786f2e0851f75d');
                    res.body.discovers[0].username.should.be.equal('testuser');
                    res.body.loggedIn._id.should.equal('5ab3e66975786f2e0851f75d');
                    done();
                });
        });
    });

    after(function (done) {
        //Restore - remove updated safe, discover and user(owner)
        Safes.find({ _id: '5ab58d002d237847c8e1b129' }).remove().exec();
        SafeDiscovers.find({ _id: '5ab3e66975786f2e0851f73d' }).remove().exec();
        Users.find({ _id: '5ab3e66975786f2e0851f72d' }).remove().exec();
        return done();
    });
});

describe('8.Get all safes from database and take data of first to display it then', () => {

    before(function (done) {
         //Remove safe for tests if it already exists
        SafeDiscovers.find({ _id: '5ab3e66975786f2e0851f73d' }).remove().exec(done);
    });

    before(function (done) {
        //Create new discovery. Discover name and id is set in test patch.
        let discovery = new SafeDiscovers({
            _id: '5ab3e66975786f2e0851f73d',
            userId: '5ab3e66975786f2e0851f75d',
            username: 'testuser',
            safeId: '5ab58d002d237847c8e1b129'
        });
        discovery.save(done)
    });

    before(function (done) {
        //Remove user for tests if it already exists
        Users.find({ _id: '5ab3e66975786f2e0851f72d' }).remove().exec(done);
    });

    before(function (done) {
        //Create new user
        let user = new Users({
            _id: '5ab3e66975786f2e0851f72d',
            name: 'user1',
            password: "123"
        });
        user.save(done)
    });

    before(function (done) {
        //Remove all safes from database
        Safes.find({}).remove().exec(done);
    });

    before(function (done) {
        //Create first safe
        let safeTest = new Safes({
            _id: '5ab58d002d237847c8e1b129',
            name: 'safeName',
            description: 'safeDescription',
            owner: '5ab3e66975786f2e0851f72d',
            localization: 'safeLocalization',
            lattitude: 9,
            longitude: 7
        });
        safeTest.save(done)
    });

    before(function (done) {
        //Create second safe
        let safeTest2 = new Safes({
            _id: '5ab58d002d237847c8e1b139',
            name: 'safeName2',
            description: 'safeDescription2',
            owner: '5ab3e66975786f2e0851f72d',
            localization: 'safeLocalization2',
            lattitude: '3',
            longitude: '4'
        });
        safeTest2.save(done)

    });

    describe('Load all safes', () => {
        it('it should get all safes and take first to display it', (done) => {
            let safe = { selectedSafeId: '5ab58d002d237847c8e1b129' };
            chai.request(server)
                .get('/load')
                .send(safe)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('discovers');
                    res.body.should.have.property('loggedIn');
                    res.body.should.have.property('loggedIn');
                    res.body.should.have.property('safes');
                    res.body.safes[0].should.have.property('_id');
                    res.body.safes[0].name.should.equal('safeName');
                    res.body.safes[0].description.should.equal('safeDescription');
                    res.body.safes[0].owner.should.equal('5ab3e66975786f2e0851f72d');
                    res.body.safes[0].localization.should.equal('safeLocalization');
                    res.body.safes[0].lattitude.should.equal(9);
                    res.body.safes[0].longitude.should.equal(7);
                    res.body.owner.should.have.property('_id');
                    res.body.owner.name.should.equal('user1');
                    res.body.discovers[0].username.should.be.equal('testuser');
                    res.body.loggedIn._id.should.equal('5ab3e66975786f2e0851f75d');

                    done();
                });
        });
    });

    after(function (done) {
        //Restore - remove updated safe, discover and users(owner and discover)
        Safes.find({ _id: '5ab58d002d237847c8e1b129' }).remove().exec();
        Safes.find({ _id: '5ab58d002d237847c8e1b139' }).remove().exec();
        SafeDiscovers.find({ _id: '5ab3e66975786f2e0851f73d' }).remove().exec();
        Users.find({ _id: '5ab3e66975786f2e0851f72d' }).remove().exec();
        return done();
    });

});



describe('9.Test user logging - positive', () => {

    before(function (done) {
        //Remove user for tests if it already exists
        Users.find({ _id: '5ab3e66975786f2e0851f72d' }).remove().exec();

        //Create new user
        let user = new Users({
            _id: '5ab3e66975786f2e0851f72d',
            name: 'user1',
            password: "123"
        });
        user.save(done)
    });

    describe('Login test', function () {
        it('should redirect to /', function (done) {
            agent
                .post('/login')
                .send({ 'username': 'user1', 'password': '123' })
                .expect('Location', './')
                .end(done)
        })

        after(function (done) {
            //Restore - remove user
            Users.find({ _id: '5ab3e66975786f2e0851f72d' }).remove(done);
        });

    })

});


describe('10.Test user logging - negative', () => {

    before(function (done) {
        //Remove user if exists
        Users.find({ name: 'non_exist' }).remove(done);
    });


    describe('Login negative test', function () {
        it('should redirect to /', function (done) {
            agent
                .post('/login')
                .send({ 'username': 'non_exist', 'password': '123' })
                .expect('Location', './login')
                .end(done)
        })

        after(function (done) {
            //Restore - remove user
            Users.find({ _id: '5ab3e66975786f2e0851f72d' }).remove(done);
        });

    })

});

describe('11. Add discovery', () => {

    before(function (done) {
        //Remove safe for tests if it already exists
        Safes.find({ _id: '5ab58d002d237847c8e1b129' }).remove().exec();

        //Create new safe
        let safeTest = new Safes({
            _id: '5ab58d002d237847c8e1b129',
            name: 'safeName',
            description: 'safeDescription',
            owner: '5ab3e66975786f2e0851f72d',
            localization: 'safeLocalization',
            lattitude: 9,
            longitude: 7,
        });
        safeTest.save(done)
    });
    describe('Discover safe', function () {

        it('it safe should be marked as discovered', (done) => {
            let discovery = { discoveredSafeId: '5ab58d002d237847c8e1b129', discovered: true };
            chai.request(server)
                .post('/safe/markdiscovered')
                .send(discovery)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({ success: true });
                    done();
                });
        });
    });

    after(function (done) {
        //Restore - remove user
        Safes.find({ _id: '5ab58d002d237847c8e1b129' }).remove(done);
    });
});


describe('12.Remove discovery', () => {

    before(function (done) {
        //Remove safe for tests if it already exists
        Safes.find({ _id: '5ab58d002d237847c8e1b129' }).remove().exec();

        //Create new safe
        let safeTest = new Safes({
            _id: '5ab58d002d237847c8e1b129',
            name: 'safeName',
            description: 'safeDescription',
            owner: '5ab3e66975786f2e0851f72d',
            localization: 'safeLocalization',
            lattitude: 9,
            longitude: 7,
        });
        safeTest.save(done)
    });
    describe('Discover safe', function () {

        it('it safe should be marked as undiscovered', (done) => {
            let discovery = { discoveredSafeId: '5ab58d002d237847c8e1b129', discovered: false };
            chai.request(server)
                .post('/safe/markdiscovered')
                .send(discovery)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({ success: true });
                    done();
                });
        });
    });

    after(function (done) {
        //Restore - remove user
        Safes.find({ _id: '5ab58d002d237847c8e1b129' }).remove(done);
    });
});