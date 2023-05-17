const routes = require('express').Router();
const controller = require('../controllers/solution.js');

routes.get('/', controller.getAll);
routes.get('/:code', controller.getByCode);


module.exports = routes;