"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyparser = require("body-parser");
var metrics_1 = require("./metrics");
var path = require("path");
var session = require("express-session");
var levelSession = require("level-session-store");
var user_1 = require("./user");
var dbUser = new user_1.UserHandler('./db/users');
var app = express();
var port = process.env.PORT || '8080';
var LevelStore = levelSession(session);
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
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
// AUTH
var authRouter = express.Router();
authRouter.get('/login', function (req, res) {
    res.render('login');
});
authRouter.post('/login', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (err)
            next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login');
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/');
        }
    });
});
authRouter.get('/signup', function (req, res) {
    res.render('signup');
});
authRouter.get('/logout', function (req, res) {
    if (req.session.loggedIn) {
        delete req.session.loggedIn;
        delete req.session.user;
    }
    res.redirect('/login');
});
app.use(authRouter);
// AUTH CHECK
var authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
// USERS
var userRouter = express.Router();
userRouter.get('/:username', function (req, res, next) {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result == undefined) {
            res.status(404).send("user not found");
        }
        else
            res.status(200).json(result);
    });
});
userRouter.post('/', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user alraedy exists");
        }
        dbUser.save(req.body, function (err) {
            if (err)
                next(err);
            else
                res.status(201).send("user persisted");
        });
    });
});
app.use('/user', userRouter);
// METRICS
var router = express.Router();
router.use(function (req, res, next) {
    console.log(req.method);
    next();
});
router.get('/', function (req, res, next) {
    var handler = new metrics_1.MetricsHandler('db/metrics');
    handler.list(function (err, result) {
        if (err)
            next(err);
        res.render('metrics', { data: result });
    });
});
router.get('/:id', function (req, res, next) {
    var handler = new metrics_1.MetricsHandler('db/metrics');
    handler.get(req.params.id, function (err, result) {
        if (err)
            next(err);
        res.json(result);
    });
});
router.post('/:id', function (req, res, next) {
    var handler = new metrics_1.MetricsHandler('db/metrics');
    handler.save(req.params.id, req.body, function (err) {
        if (err)
            next(err);
        console.log('data posted');
        res.end();
    });
});
router.delete('/', function (req, res, next) {
    var handler = new metrics_1.MetricsHandler('db/metrics');
    handler.remove(req.body.key, function (err) {
        if (err)
            next(err);
        console.log('data posted');
        res.end();
    });
});
app.use('/metrics', authCheck, router);
app.get('*', function (req, res) {
    res.status(404).render('notFound', { url: req.url });
});
app.use(function (err, req, res) {
    console.error(err.stack);
    res.status(500).send("Smoething broke");
});
