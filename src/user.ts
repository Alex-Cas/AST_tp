const bcrypt = require('bcryptjs')

export class User {
    public username: string
    public email: string
    private password: string = ""

    constructor(username: string, email: string, password: string, passwordHashed: boolean = true) {
        this.username = username
        this.email = email

        if (!passwordHashed) {
        
            this.setPassword(password)
        }
        else {

            this.password = password
        }
    }

    static fromDb(username: string, value: any): User {
        const [password, email] = value.split(':')
        return new User(username, email, password)
    }

    public setPassword(toSet: string): void {
        var hash = bcrypt.hashSync(toSet, 10)
        this.password = hash
    }

    public getPassword(): string {
        return this.password
    }

    public validatePassword(toValidate: String): boolean {
        var toReturn = bcrypt.compareSync(toValidate, this.getPassword())
        return toReturn
    }
}

import { LevelDb } from "./leveldb"
import WriteStream from 'level-ws'

export class UserHandler {
    public db: any

    public get(username: string, callback: (err: Error | null, result?: User) => void) {
        this.db.get(`user:${username}`, (err: Error, data: any) => {
             if (err) callback(err)
             else if (data === undefined) callback(null, data)
             else callback(null, User.fromDb(username, data))
        })
    }

    public save(user: any, callback: (err: Error | null) => void) {

        user = new User(user.username, user.email, user.password, false)

        this.db.put(
            `user:${user.username}`,
            `${user.getPassword()}:${user.email}`,
            (err: Error | null) => {
                callback(err)
            }
        )
    }

    public remove(username: string, callback: (err: Error | null) => void) {
        
        this.db.del(
            `user:${username}`,
            (error: Error | null) => {

                if (error) callback(error)
                else callback(null)
            }
        )
    }

    constructor(path: string) {
        this.db = LevelDb.open(path)
    }
}