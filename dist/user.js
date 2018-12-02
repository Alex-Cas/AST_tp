"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(username, email, password, passwordHashed) {
        if (passwordHashed === void 0) { passwordHashed = false; }
        this.password = "";
        this.username = username;
        this.email = email;
        if (!passwordHashed) {
            this.password = password;
            //this.setPassword(password)
        }
    }
    User.fromDb = function (username, value) {
        var _a = value.split(':'), password = _a[0], email = _a[1];
        return new User(username, email, password);
    };
    User.prototype.setPassword = function (toSet) {
        this.password = toSet;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.validatePassword = function (toValidate) {
        return this.password === toValidate;
    };
    return User;
}());
exports.User = User;
var leveldb_1 = require("./leveldb");
var UserHandler = /** @class */ (function () {
    function UserHandler(path) {
        this.db = leveldb_1.LevelDb.open(path);
    }
    UserHandler.prototype.get = function (username, callback) {
        this.db.get("user:" + username, function (err, data) {
            if (err)
                callback(err);
            else if (data === undefined)
                callback(null, data);
            else
                callback(null, User.fromDb(username, data));
        });
    };
    UserHandler.prototype.save = function (user, callback) {
        user = new User(user.username, user.email, user.password);
        this.db.put("user:" + user.username, user.getPassword() + ": " + user.email, function (err) {
            callback(err);
        });
    };
    UserHandler.prototype.remove = function (username, callback) {
        this.db.del("user:" + username, function (error) {
            if (error)
                callback(error);
            else
                callback(null);
        });
    };
    return UserHandler;
}());
exports.UserHandler = UserHandler;
