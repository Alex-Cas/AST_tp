"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import 'should'
var chai_1 = require("chai");
var user_1 = require("./user");
var leveldb_1 = require("./leveldb");
var assert = require('assert');
var dbPath = 'db_test/users';
var dbUser;
describe('Users', function () {
    before(function () {
        leveldb_1.LevelDb.clear(dbPath);
        dbUser = new user_1.UserHandler(dbPath);
    });
    after(function () {
        dbUser.db.close();
    });
    describe('#save', function () {
        it('shoud save data', function (done) {
            var user = {
                'username': 'alexandre',
                'email': 'alex@mail.fr',
                'password': 'alexpw'
            };
            dbUser.save(user, function (err) {
                assert.equal(err, null);
                done();
            });
        });
    });
    describe('#get', function () {
        it('should get user alexandre', function () {
            dbUser.get('alexandre', function (err, result) {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.not.be.null;
                chai_1.expect(result).to.have.property('email', 'alex@mail.fr');
            });
        });
    });
    describe('#delete', function () {
        it('should delete user', function (done) {
            dbUser.remove('alexandre', function (err) {
                assert.equal(err, null);
                done();
            });
        });
    });
    describe('#get', function () {
        it('should fail to get user alexandre', function () {
            dbUser.get('alexandre', function (err, result) {
                chai_1.expect(err).to.not.be.null;
                chai_1.expect(result).to.be.undefined;
            });
        });
    });
});
