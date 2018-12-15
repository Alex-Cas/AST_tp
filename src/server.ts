import express = require('express')
import morgan = require('morgan')
import bodyparser = require('body-parser')
import { MetricsHandler } from './metrics'
import path = require('path')
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'

const app = express()
const port: string = process.env.PORT || '8080'

const LevelStore = levelSession(session)

app.use(morgan('dev'))

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

authRouter.get('/login', (req: any, res: any) => {
    res.render('login')
})


const dbUser: UserHandler = new UserHandler('./db/users')

authRouter.post('/login', (req: any, res: any, next: any) => {

    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
        //if (err) next(err)
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login')
        }
        else {
            req.session.loggedIn = true
            req.session.user = result
            res.redirect('/metrics')
        }
    })
})

authRouter.get('/signup', (req: any, res: any) => {
    res.render('signup')
})

authRouter.get('/logout', (req: any, res: any) => {
    if (req.session.loggedIn) {

        console.log("success logout")
        delete req.session.loggedIn
        delete req.session.user
    }
    res.redirect('/login')
})

app.use(authRouter)


// AUTH CHECK

const authCheck = (req: any, res: any, next: any) => {
    if (req.session.loggedIn) {
        next()
    } else res.redirect('/login')
}


// USERS

const userRouter = express.Router()

userRouter.get('/:username', (req: any, res: any, next: any) => {

    dbUser.get(req.params.username, (err: Error | null, result?: User) => {
        if (err || result == undefined) {
            res.status(404).send("user not found")
        } else res.status(200).json(result)
    }) 
})

userRouter.post('/', (req: any, res: any, next: any) => {

    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists")
        }
        else {

            dbUser.save(req.body, (err: Error | null) => {
                if (err) next(err)
                else res.status(201).send("user persisted")
            })
        }
    })
})

userRouter.delete('/:username', (req: any, res: any, next: any) => {

    dbUser.remove(req.params.username, (err: Error | null) => {

        console.log(err)
        if (err) res.status(404).send(`user ${req.params.username} not found`)
        else res.status(200).send(`success deletion of ${req.params.username}`)
    })
})


app.use('/user', userRouter)

// METRICS
const metricsRouter = express.Router()

metricsRouter.use( (req: any, res: any, next: any) => {
    console.log(req.method)
    next()
})

const dbMet = new MetricsHandler('db/metrics')

metricsRouter.get('/', (req: any, res: any, next: any) => {

    dbMet.list(req.session.user.username, (err: Error | null, result?: any) => {
        if (err) next(err)
        res.render('metrics', {data: result})
    })
})

metricsRouter.post('/', (req: any, res: any, next: any) => {

    dbMet.save(req.session.user.username, req.body, (err: Error | null) => {
        if (err) next(err)
        console.log('data posted')
        res.redirect('/metrics')
    })
})

metricsRouter.delete('/', (req: any, res: any, next: any) => {

    dbMet.remove(req.body.key, (err: Error | null) => {
        if (err) next(err)
        res.redirect(303, '/metrics')
        console.log(err)
    })
})

app.use('/metrics', authCheck, metricsRouter)



app.get('*', (req, res) => {
    res.status(404).render('notFound', {url: req.url})
})


app.use(function (err: Error, req: any, res: any) {
    console.error(err.stack)
    res.status(500).send("Smoething broke")
})