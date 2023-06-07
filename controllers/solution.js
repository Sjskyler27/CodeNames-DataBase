const _ = require('lodash');
const database = require('../db/connect');
const Api404Error = require('../error-handler/apiError404')

const getAll = async (req, res)=>{
    // #swagger.description = 'get all solutions'
    const db = await database.connectDatabase();
    const result = await db.collection('solutions').find().toArray();
    if (result){
        throw new Api404Error(`game codes not found.`);
    }
    console.log(result);
    res.send(result);
};

const getByCode = async (req, res)=>{
    // #swagger.description = 'Retrieves a solution by code.'
    // #swagger.parameters['code'] = { in: 'path', description: 'Code of the solution to retrieve', required: true, type: 'string' }
  
    console.log('throw error');
    try{
        const db = await database.connectDatabase();
        const code = req.params.code;
        const result = await db.collection('solutions').findOne({"code": code});
        if (result == null){
            throw new Api404Error(`game with id: ${req.params.code} not found.`);
        }
        console.log(result);
        res.send(result);
    }
    catch(e){
        console.error(e);
        res.status(500).json('An error occurred while retrieving that game.');
    }
    
};

const getAllCodes = async (req, res) => {
    // #swagger.description = 'Retrieves all codes.'
    console.log('getting all codes.')
    const db = await database.connectDatabase();
    try {
        const result = await db.collection('solutions').find({}, { code: 1 }).toArray();
        const codes = result.map((item) => item.code);
        console.log(codes);
        res.send(codes);
    } catch (error) {
        console.error(error);
        res.status(500).json('An error occurred while retrieving the codes.');
    }
};

const basicCreate = async (req, res)=>{
    // #swagger.description = 'Creates a new solution.'
    // #swagger.parameters['body'] = { in: 'body', description: 'Solution data', required: true, schema: { $ref: '#/definitions/SolutionData' } }
    const db = await database.connectDatabase();
    console.log('attempting to insert: \n' + req.body);
    const solution = {
        code: req.body.code,
        words: req.body.words,
        firstPlayer: req.body.firstPlayer,
        Player1: req.body.Player1,
        Player2: req.body.Player2,
        Yellow: req.body.Yellow,
        Black: req.body.Black
      };

    const response = await db.collection('solutions').insertOne(solution);

    if (response.acknowledged) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'could not create the solution.');
    }
};
const createFromWords = async (req, res)=>{
    // #swagger.description = 'Creates a new solution from words.'
    // #swagger.parameters['body'] = { in: 'body', description: 'List of words', required: true, schema: { $ref: '#/definitions/WordList' } }
  
    const db = await database.connectDatabase();
    console.log('attempting to create document: \n');

    const getWords =  _.shuffle(req.body.wordList)
    
    const wordList = getWords.slice(0,25);
    const code= _.sampleSize('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4).join('');
    const firstPlayer= _.sample(['red', 'blue']);
    const player1= wordList.slice(0,9);
    const player2= wordList.slice(9,17);
    const yellow= wordList.slice(17,24);
    const black= wordList.slice(24,25);
    const shuffledWords = _.shuffle(wordList)

    const solution = {
        code: code, 
        words: shuffledWords,
        firstPlayer: firstPlayer,
        Player1: player1,
        Player2: player2,
        Yellow: yellow,
        Black: black,
        clicked: ['test']
      };
    
    const response = await db.collection('solutions').insertOne(solution);
    
    if (response.acknowledged) {
        // Send a response with the code and other data
        res.status(201).json({
            code: code,
            message: "Solution created successfully",
            documentId: response.insertedId // You might also want the MongoDB document ID
        });

        // After adding a new one, delete the first
        await db.collection('solutions').findOneAndDelete({});
    } else {
        res.status(500).json(response.error || 'could not create the solution.');
    }

    
}

const addToClicked = async (req, res) => {
    const db = await database.connectDatabase();
    
    const code = req.params.code;
    console.log(code);

    const clickedString = req.body.clicked;
    
    let response;
    // response = await db.collection('solutions').updateOne({ code: code }, { $push: { clicked: clickedString } });
    try {
      const gameCollection = db.collection('solutions');
      const game = await gameCollection.findOne({ code: code });
  
      if (!game) {
        throw new Error('Game not found');
      }

      if (!game.clicked) {
        // If 'clicked' field doesn't exist, create it as an array with the clickedString
        response = await gameCollection.updateOne({ code: code }, { $set: { clicked: [clickedString] } });
      } else {
        // 'clicked' field exists, push the clickedString to the array
        response = await gameCollection.updateOne({ code: code }, { $push: { clicked: clickedString } });
      }
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while adding the clicked string.');
    }
    if (response.acknowledged) {
        res.status(200).json(response);
    } else {
        res.status(500).json(response.error || 'could not update the clicked cards.');
    }
  };
  


const deleteFirst = async (req, res) => {
    // #swagger.description = 'Deletes the first solution.'
    const db = await database.connectDatabase();

    // Find and delete the first document
    const response = await db.collection('solutions').findOneAndDelete({});
    if (response.ok) {
        res.status(200).json({ message: 'First document deleted successfully' });
    } else {
        res.status(500).json(response.error || 'Could not delete the document.');
    }
}


module.exports = {
    getAll,
    getByCode,
    getAllCodes,
    basicCreate,
    createFromWords,
    addToClicked,
    deleteFirst
};