import express from 'express';
const app =   express();

/*  express.json() extracts the body portion of an incoming request and assigns
    it to req.body.
 */
app.use( express.json() );

const port = 9080;
app.listen(port, () => {
    const host = "localhost";
    console.log(`App is running @ http://${host}:${port}/`);
});