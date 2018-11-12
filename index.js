express = require('express')
path = require('path')
app = express()

app.set('views', "./views")
app.set('view engine', 'ejs');

app.use('/', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))
app.use('/', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.set('port', 8080)

app.listen(
  app.get('port'), 
  () => console.log(`Server listening on ${app.get('port')}`)
)

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/hello/:name', (req, res) => {
    res.render('hello', {name: req.params.name})
})

app.get('*', (req, res) => {
    res.status(404).render('notFound', {url: req.url})
})