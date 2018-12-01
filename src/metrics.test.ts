import 'should'
import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDb } from "./leveldb"
var assert = require('assert')

const dbPath: string = 'db_test'
var dbMet: MetricsHandler

describe('Metrics', function () {

    before(function () {
        LevelDb.clear(dbPath)
        dbMet = new MetricsHandler(dbPath)
    })

    after(function () {
        dbMet.db.close()
    })

    describe('#get', function () {
        it('should get empty array on non existing group', function () {
            dbMet.get("0", function (err: Error | null, result?: Metric[]) {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.be.empty
            })
        })
    })

    describe('#save', () => {
        
        it('shoud save data', (done) => {
            const metrics: Metric[] = [
                new Metric('0', 10),
                new Metric('1', 11)
            ]
            dbMet.save(0, metrics, (err: Error | null) => {
                assert.equal(err, null)
                done()
            })
        })
    })

    /*describe('#delete', () => {

        it('should delete data', (done) => {

        })
    })*/
})