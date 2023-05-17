const routes = require('express').Router();
const controller = require('../controllers/solution.js');
const cors = require('cors'); // Import the cors middleware

routes.use(cors()); // Enable CORS for all routes

routes.get('/', controller.getAll);
routes.get('/:code', controller.getByCode);

routes.post('/create', controller.basicCreate);

module.exports = routes;