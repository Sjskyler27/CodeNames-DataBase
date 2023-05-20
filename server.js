// express web server 
const express = require('express'); // require is grabbing from node modules, it allows us to use express on this page
const bodyParser = require('body-parser'); 
const cors = require('cors'); // Import the cors middleware

const swaggerUi = require('swagger-ui-express') // this will help us display the swagger file 
const swaggerFile = require('./swagger-output.json') // created file using swagger auto gen

const app = express();

app.use(bodyParser.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/', require('./routes/solution'));
app.use(cors()); // Enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  }); // allow front end access 

const port = process.env.port || 8080;
app.listen(port)
console.log(`Web server at port: ${port}`);