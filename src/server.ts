import express = require('express')
import bodyparser = require('body-parser')
import { MetricsHandler } from './metrics'
import path = require('path')
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'

const dbUser: UserHandler = new UserHandler('./db/users')

const app = express()
const port: string = process.env.PORT || '8080'

const LevelStore = levelSession(session)


app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

app.set('views', "./views")
app.set('view engine', 'ejs');

app.use('/', express.static(path.join(__dirname, '/../node_modules/bootstrap/dist')))
app.use('/', express.static(path.join(__dirname, '/../node_modules/jquery/dist')))

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.get('/', (req, res) => {
  res.render('home')
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})

// AUTH
const authRouter = express.Router()

authRouter.get('/login', function (req: any, res: any) {
    res.render('login')
})

authRouter.post('/login', function(req: any, res: any, next: any) {
    dbUser.get(req.body.username, function(err: Error | null, result?: User) {
        if (err) next(err)
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login')
        }
        else {
            req.session.loggedIn = true
            req.session.user = result
            res.redirect('/')
        }

    })
})

authRouter.get('/signup', function(req: any, res: any) {
    res.render('signup')
})

authRouter.get('/logout', function(req: any, res: any) {
    if (req.session.loggedIn) {

        delete req.session.loggedIn
        delete req.session.user
    }
    res.redirect('/login')
})

app.use(authRouter)


// AUTH CHECK

const authCheck = function(req: any, res: any, next: any) {
    if (req.session.loggedIn) {
        next()
    } else res.redirect('/login')
}


// USERS

const userRouter = express.Router()

userRouter.get('/:username', function(req: any, res: any, next: any) {
    dbUser.get(req.params.username, function(err: Error | null, result?: User) {
        if (err || result == undefined) {
            res.status(404).send("user not found")
        } else res.status(200).json(result)
    }) 
})

userRouter.post('/', function(req: any, res: any, next: any) {
    dbUser.get(req.body.username, function(err: Error | null, result?: User) {
        if (!err || result !== undefined) {
            res.status(409).send("user alraedy exists")
        }
        dbUser.save(req.body, function(err: Error | null) {
            if (err) next(err)
            else res.status(201).send("user persisted")
        })
    })
})


app.use('/user', userRouter)

// METRICS
const router = express.Router()

router.use(function (req: any, res: any, next: any) {
    console.log(req.method)
    next()
})

router.get('/', (req: any, res: any, next: any) => {
    const handler = new MetricsHandler('db/metrics')
    handler.list((err: Error | null, result?: any) => {
        if (err) next(err)
        res.render('metrics', {data: result})
    })
})

router.get('/:id', (req: any, res: any, next: any) => {
    const handler = new MetricsHandler('db/metrics')
    handler.get(req.params.id, (err: Error | null, result?: any) => {
        if (err) next(err)
        res.json(result)
    })
})

router.post('/:id', (req: any, res: any, next: any) => {
    const handler = new MetricsHandler('db/metrics')
    handler.save(req.params.id, req.body, (err: Error | null) => {
        if (err) next(err)
        console.log('data posted')
        res.end()
    })
})

router.delete('/', (req: any, res: any, next: any) => {
    const handler = new MetricsHandler('db/metrics')
    handler.remove(req.body.key, (err: Error | null) => {
        if (err) next(err)
        console.log('data posted')
        res.end()
    })
})

app.use('/metrics', authCheck, router)



app.get('*', (req, res) => {
    res.status(404).render('notFound', {url: req.url})
})


app.use(function (err: Error, req: any, res: any) {
    console.error(err.stack)
    res.status(500).send("Smoething broke")
})