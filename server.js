// express web server 
const express = require('express'); // require is grabbing from node modules, it allows us to use express on this page
const bodyParser = require('body-parser'); 

const app = express();

app.use(bodyParser.json());
app.use('/', require('./routes/solution'));

app.listen(8080);

console.log(`Web server at port: ${8080}`);