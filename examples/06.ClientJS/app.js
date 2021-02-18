const express	   =  require('express');
const app		   =   express();

/*  express.json() extracts the body portion of an incoming request and assigns
    it to req.body.
 */
app.use( express.json() );

//Allow serving static files from public folder
app.use( express.static('public') );

//Mount the routes to the app
const routes = require('./routes');
app.use('/api/', routes);

const port = 9080;
app.listen(port, () => {
    const host = "localhost";
    console.log(`App is running @ http://${host}:${port}/`);
});