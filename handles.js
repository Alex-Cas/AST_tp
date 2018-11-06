const url = require('url')
const qs = require('querystring')

const homeInfo = 'On se retrouve sur l\'url /hello ! \n' +
'Entrez votre nom dans l\'url pour que je vous dise bonjour, sinon mettez le mien (Alexandre) pour avoir des infos sur moi'

const alexInfo = 'Alexandre est un jeune cadre dynamique (Etudiant) a l\'ECE Paris'

const notFound = 'Error 404: Page not found'

module.exports = {
  serverHandle: function (req, res) {

    const route = url.parse(req.url)
    const path = route.pathname 
    const params = qs.parse(route.query)

    res.writeHead(200, {'Content-Type': 'text/plain'});

    if (path === '/hello' && 'name' in params) {
        
        if (params['name'] === 'Alexandre') {
            
            res.write(alexInfo)
        }
        else {

            res.write('Hello ' + params['name'])
        }
    }
    else if (path === '/hello') {

        res.write('Hello anonymous !');
    } 
    else if (path === '/') {

        res.write(homeInfo);
    }
    else {

        res.write(notFound)
    }

    res.end();
  } 
}