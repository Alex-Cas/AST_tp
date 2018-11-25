"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyparser = require("body-parser");
var metrics_1 = require("./metrics");
var path = require("path");
var app = express();
var port = process.env.PORT || '8080';
app.set('views', "./views");
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, '/../node_modules/bootstrap/dist')));
app.use('/', express.static(path.join(__dirname, '/../node_modules/jquery/dist')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.get('/', function (req, res) {
    res.render('home');
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
app.get('/metrics', function (req, res) {
    var handler = new metrics_1.MetricsHandler('db/metrics');
    handler.get(function (err, result) {
        if (err) {
            throw err;
        }
        res.render('metrics', { data: result });
    });
});
app.post('/metrics', function (req, res) {
    var handler = new metrics_1.MetricsHandler('db/metrics');
    handler.save(1, req.body, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('data posted');
        res.end();
    });
});
app.delete('/metrics', function (req, res) {
    var handler = new metrics_1.MetricsHandler('db/metrics');
    handler.remove(req.body.key, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('data posted');
        res.end();
    });
});
app.get('*', function (req, res) {
    res.status(404).render('notFound', { url: req.url });
});
