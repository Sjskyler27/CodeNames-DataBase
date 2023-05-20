const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CodeNames API',
    description: 'This API creates games for CodeNames',
  },
  host: 'codenamesdb.onrender.com',
  schemes: ['https','http'],
  definitions: {
    WordList: {
      type: 'object',
      properties: {
        wordList: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
      required: ['wordList'],
    },
    SolutionData: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
        },
        words: {
          type: 'string',
        },
        firstPlayer: {
          type: 'string',
        },
        Player1: {
          type: 'string',
        },
        Player2: {
          type: 'string',
        },
        Yellow: {
          type: 'string',
        },
        Black: {
          type: 'string',
        },
      },
      required: ['code', 'words', 'firstPlayer', 'Player1', 'Player2', 'Yellow', 'Black'],
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/solution.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);