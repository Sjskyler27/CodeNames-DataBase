const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CodeNames API',
    description: 'This API creates games for CodeNames',
  },
  host: 'https://codenamesdb.onrender.com',
  schemes: ['https','http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/solution.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);