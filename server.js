// express web server 
const express = require('express'); // require is grabbing from node modules, it allows us to use express on this page
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const swaggerUi = require('swagger-ui-express') // this will help us display the swagger file 
const swaggerFile = require('./swagger-output.json') // created file using swagger auto gen

const app = express();

// include authentication
const { auth } = require("express-openid-connect");
const dotenv = require('dotenv');
dotenv.config()
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};
// attach /login /logout /callback routs this is the key
app.use(auth(config));



app.use(bodyParser.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/', require('./routes/solution'));
app.use('/duet/', require('./routes/duet_solution'));
app.use(cors()); // Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}); // allow front end access 

const port = process.env.port || 8080;
app.listen(port)
console.log(`Web server at port: ${port}`);
console.log('http://localhost:8080/doc/#/');