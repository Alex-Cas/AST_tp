import express = require('express')
import bodyparser = require('body-parser')
import { MetricsHandler } from './metrics'
import path = require('path')

const app = express()
const port: string = process.env.PORT || '8080'

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

app.get('/metrics', (req: any, res: any) => {
    const handler = new MetricsHandler('db/metrics')
    handler.get((err: Error | null, result?: any) => {
        if (err) {
            throw err
        }
        res.render('metrics', {data: result})
    })
})

app.post('/metrics', (req: any, res:any) => {
    const handler = new MetricsHandler('db/metrics')
    handler.save(1, req.body, (err: Error | null) => {
        if (err) {
            console.log(err)
        }
        console.log('data posted')
        res.end()
    })
})

app.delete('/metrics', (req: any, res:any) => {
    const handler = new MetricsHandler('db/metrics')
    handler.remove(req.body.key, (err: Error | null) => {
        if (err) {
            console.log(err)
        }
        console.log('data posted')
        res.end()
    })
})

app.get('*', (req, res) => {
    res.status(404).render('notFound', {url: req.url})
})