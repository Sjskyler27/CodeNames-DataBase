const routes = require('express').Router();
const controller = require('../controllers/duet_solution.js');
const cors = require('cors'); // Import the cors middleware

routes.use(cors()); // Enable CORS for all routes

routes.get('/getAllCodes', controller.getAllCodes);
routes.get('/:code', controller.getByCode);
routes.get('/', controller.getAll);

routes.post('/create', controller.basicCreate);
routes.post('/createFromWords', controller.createFromWords);

routes.put('/addToClicked/:code', controller.addToClicked);
// routes.put('/clearClicked', controller.clearClicked);

routes.delete('/deleteFirst', controller.deleteFirst);

console.log('you are conected to duet');
module.exports = routes;