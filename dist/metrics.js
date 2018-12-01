"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var level_ws_1 = __importDefault(require("level-ws"));
var Metric = /** @class */ (function () {
    function Metric(ts, v) {
        this.timestamp = new Date(ts);
        this.value = v;
    }
    return Metric;
}());
exports.Metric = Metric;
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(dbPath) {
        this.db = leveldb_1.LevelDb.open(dbPath);
    }
    MetricsHandler.prototype.list = function (callback) {
        var _this = this;
        var stream = this.db.createReadStream();
        var result = [];
        stream.on('data', function (data) { result.push(data); });
        stream.on('error', callback);
        stream.on('close', callback);
        stream.on('end', function () {
            _this.db.close();
            callback(null, result);
        });
    };
    MetricsHandler.prototype.get = function (key, callback) {
        var _this = this;
        var stream = this.db.createReadStream();
        var result = [];
        stream.on('data', function (data) {
            if (data.key.split(':')[1] == key) {
                result.push(data);
            }
            else {
                console.log('not found');
            }
        });
        stream.on('error', callback);
        stream.on('close', callback);
        stream.on('end', function () {
            _this.db.close();
            callback(null, result);
        });
    };
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        var _this = this;
        var stream = level_ws_1.default(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach(function (m) {
            stream.write({ key: "metric:" + key + ":" + m.timestamp, value: m.value });
        });
        stream.end(function () {
            _this.db.close;
            callback(null);
        });
    };
    MetricsHandler.prototype.remove = function (key, callback) {
        var _this = this;
        this.db.del(key, function (err) {
            if (err)
                console.log(err);
            _this.db.close();
            callback(err);
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
