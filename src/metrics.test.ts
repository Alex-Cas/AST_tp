//import 'should'
import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDb } from "./leveldb"
var assert = require('assert')

const dbPath: string = 'db_test/metrics'
var dbMet: MetricsHandler

describe('Metrics', function () {

    before(function () {
        LevelDb.clear(dbPath)
        dbMet = new MetricsHandler(dbPath)
    })

    after(function () {
        dbMet.db.close()
    })

    describe('#save', () => {
        
        it('shoud save data', (done) => {
            const metrics: Metric[] = [
                new Metric('0', 10),
                new Metric('1', 11)
            ]
            dbMet.save('alexandre', metrics, (err: Error | null) => {
                assert.equal(err, null)
                done()
            })
        })
    })

    describe('#get', () => {
        it('should get empty array on non existing group', function () {
            dbMet.list('alexandre', function (err: Error | null, result?: Metric[]) {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.not.be.empty
            })
        })
    })

    describe('#delete', () => {

        it('should delete data', (done) => {
            dbMet.remove('metric:alexandre:0', (err: Error | null) => {
                assert.equal(err, null)
                done()
            })
        })
    })
})