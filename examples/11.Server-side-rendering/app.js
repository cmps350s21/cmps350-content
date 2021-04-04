const express	   =  require('express')
const handlebars   =  require('express-handlebars')

const app		   =   express()

//Allow serving static files from __dirname which is the current folder
app.use( express.static(__dirname) )

/*
 body-parser extracts the entire body portion of an incoming request and assigns it to req.body.
 Parses the body text as URL encoded data (which is how browsers send form data from forms with method set to POST)
 and exposes the resulting object (containing the keys and values) on req.body.
 */
app.use( bodyParser.urlencoded({extended: true}) )
//If the body of incoming request is a json object then assign it to req.body property
app.use( express.json() )

/* Configure handlebars:
     set extension to .hbs so handlebars knows what to look for
     set the defaultLayout to 'main' so that all partial templates will be rendered and inserted in the main's {{{body}}}
     the main.hbs defines define page elements such as the menu and imports all the common css and javascript files
 */
app.engine('hbs', handlebars({defaultLayout: 'main', extname: '.hbs'}))

// Register handlebars as the view engine to be used to render the templates
app.set('view engine', 'hbs')

//Set the location of the view templates
app.set('views', __dirname + '/views')

//Mount the routes to the app
const routes = require('./routes')
app.use('/', routes)

const port = 3000
app.listen(port, () => {
    const host = "localhost"
    console.log(`Students App is running @ http://${host}:${port}`)
})