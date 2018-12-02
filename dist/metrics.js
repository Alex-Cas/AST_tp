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
    MetricsHandler.prototype.list = function (key, callback) {
        var result = [];
        this.db.createReadStream()
            .on('data', function (data) {
            if (data.key.split(':')[1] == key) {
                result.push(data);
            }
        })
            .on('error', function (err) { callback(err); })
            .on('end', function () { callback(null, result); });
    };
    /*public get(key: string, callback: (error: Error | null, result?: Metric[]) => void) {

        let result: any[] = []

        this.db.createReadStream()
            .on('data', (data) => {
                if (data.key.split(':')[1] == key) {
                    result.push(data)
                }
            })
            .on('error', (err) => {callback(err)})
            .on('end', () => {callback(null, result)})
    }*/
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        var stream = level_ws_1.default(this.db);
        if (!Array.isArray(metrics)) {
            metrics = [metrics];
        }
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach(function (m) {
            stream.write({ key: "metric:" + key + ":" + m.timestamp, value: m.value });
        });
        stream.end(function () {
            callback;
        });
    };
    MetricsHandler.prototype.remove = function (key, callback) {
        this.db.del(key, function (err) {
            if (err)
                console.log(err);
            callback(err);
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
