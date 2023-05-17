// express web server 
const express = require('express'); // require is grabbing from node modules, it allows us to use express on this page
const bodyParser = require('body-parser'); 

const app = express();

app.use(bodyParser.json());
app.use('/', require('./routes/solution'));

const port = process.env.port || 8080;
app.listen(port)
console.log(`Web server at port: ${port}`);