"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import 'should'
var chai_1 = require("chai");
var metrics_1 = require("./metrics");
var leveldb_1 = require("./leveldb");
var assert = require('assert');
var dbPath = 'db_test/metrics';
var dbMet;
describe('Metrics', function () {
    before(function () {
        leveldb_1.LevelDb.clear(dbPath);
        dbMet = new metrics_1.MetricsHandler(dbPath);
    });
    after(function () {
        dbMet.db.close();
    });
    describe('#save', function () {
        it('shoud save data', function (done) {
            var metrics = [
                new metrics_1.Metric('0', 10),
                new metrics_1.Metric('1', 11)
            ];
            dbMet.save('alexandre', metrics, function (err) {
                assert.equal(err, null);
                done();
            });
        });
    });
    describe('#get', function () {
        it('should get empty array on non existing group', function () {
            dbMet.list('alexandre', function (err, result) {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.not.be.empty;
            });
        });
    });
    describe('#delete', function () {
        it('should delete data', function (done) {
            dbMet.remove('metric:alexandre:0', function (err) {
                assert.equal(err, null);
                done();
            });
        });
    });
});
