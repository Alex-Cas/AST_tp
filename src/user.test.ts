//import 'should'
import { expect } from 'chai'
import { User, UserHandler } from './user'
import { LevelDb } from "./leveldb"
var assert = require('assert')

const dbPath: string = 'db_test/users'
var dbUser: UserHandler

describe('Users', function () {

    before(function () {
        LevelDb.clear(dbPath)
        dbUser = new UserHandler(dbPath)
    })

    after(function () {
        dbUser.db.close()
    })

    describe('#save', () => {
        
        it('shoud save data', (done) => {
            const user = {
                'username': 'alexandre',
                'email': 'alex@mail.fr',
                'password': 'alexpw'
            }
            dbUser.save(user, (err: Error | null) => {
                assert.equal(err, null)
                done()
            })
        })
    })

    describe('#get', () => {

        it('should get user alexandre', function () {
            dbUser.get('alexandre', (err: Error | null, result?: User) => {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.not.be.null
                expect(result).to.have.property('email', 'alex@mail.fr')
            })
        })
    })

    describe('#delete', () => {

        it('should delete user', (done) => {
            dbUser.remove('alexandre', (err: Error | null) => {
                assert.equal(err, null)
                done()
            })
        })
    })

    describe('#get', () => {

        it('should fail to get user alexandre', function () {
            dbUser.get('alexandre', (err: Error | null, result?: User) => {
                expect(err).to.not.be.null
                expect(result).to.be.undefined
            })
        })
    })
})