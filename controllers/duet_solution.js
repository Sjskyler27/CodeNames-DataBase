const _ = require('lodash');
const { check, validationResult } = require('express-validator')

const database = require('../db/connect');
const duetjson = require('../json/duetest.json');

const getAll = async (req, res)=>{
    // #swagger.description = 'get all duet_solutions'
    const db = await database.connectDatabase();
    const result = await db.collection('duet_solutions').find().toArray();
    console.log(result);
    res.send(result);
};

const getByCode = async (req, res)=>{
    // #swagger.description = 'Retrieves a solution by code.'
    // #swagger.parameters['code'] = { in: 'path', description: 'Code of the solution to retrieve', required: true, type: 'string' }
    
    const db = await database.connectDatabase();
    const code = req.params.code;

    // vallidate the code
    try{
        check(code).isLength({max: 4});
    }
    catch(e){
        res.send(e);
    }
    try{
        const result = await db.collection('duet_solutions').findOne({"code": code});
        console.log(result);
        res.send(result);
    }catch (error) {
        console.error(error);
        res.status(500).json('An error occurred while retrieving that code.');
    }
};

const getAllCodes = async (req, res) => {
    // #swagger.description = 'Retrieves all codes.'
    console.log('getting all codes.')
    const db = await database.connectDatabase();
    try {
        const result = await db.collection('duet_solutions').find({}, { code: 1 }).toArray();
        const codes = result.map((item) => item.code);
        console.log(codes);
        res.send(codes);
    } catch (error) {
        console.error(error);
        res.status(500).json('An error occurred while retrieving the codes.');
    }
};

function generateChild1(solution) {
    let green = [];
    let yellow = [];
    let black = [];

    green = solution.Green.slice(0, 9); // get the first 9 greens

    yellow = solution.Green.slice(9, 14); // get the last 5 greens, not the last green
    yellow.push(...solution.Yellow.slice(0, 8)); // add 8 yellows, not the last yellows

    black.push(solution.Black[0]); // get the double black
    black.push(solution.Green[14]); // get the last green
    black.push(solution.Yellow[8]); // get the last yellow

    const player1 = {
        Green: green,
        Yellow: yellow,
        Black: black
    };

    console.log(player1);
    return player1;
}


function generateChild2(solution) {
    let green = [];
    let yellow = [];
    let black = [];

    green = solution.Green.slice(6, 15); // get the last 9 greens

    yellow = solution.Green.slice(1, 6); // get the first 5 greens, not the first green
    yellow.push(...solution.Yellow.slice(1, 9)); // add 8 yellows, not the first yellows

    black.push(solution.Black[0]); // get the double black
    black.push(solution.Green[0]); // get the first green
    black.push(solution.Yellow[0]); // get the first yellow

    const player2 = {
        Green: green,
        Yellow: yellow,
        Black: black
    };

    console.log(player2);
    return player2;
}


const basicCreate = async (req, res)=>{
    // #swagger.description = 'Creates a new solution.'
    // #swagger.parameters['body'] = { in: 'body', description: 'Solution data', required: true, schema: { $ref: '#/definitions/SolutionData' } }
    const db = await database.connectDatabase();
    console.log('attempting to insert: \n' + req.body);
    const solution = {
        code: req.body.code,
        words: req.body.words,
        firstPlayer: req.body.firstPlayer,
        Green: req.body.Player1,
        Yellow: req.body.Yellow,
        Black: req.body.Black
    };
    // logic for creating a solution from the perspective of each player 
    // there are 15 correct green cards, 9 yellow cards, and 1 black card.
    // each player sees 9 green cards 13 yellow and 3 black from their perspective.
    // there is overlap with what each knows. of the 9 green that each know 3 are green for both players
    // one card that a player sees as green is black for the other and one that is yellow is seen as black.

    // to achive this we take our solution and go up the green for one player and down the green for the other.
    // we select both opposite ends for the green and assign them as black for the corisponding player.
    // we do the same with the yellows.

    const player1Solution = generateChild1(solution);
    const player2Solution = generateChild2(solution);

    // append them to the parent element
    

    // insert the solution into the db
    const response = await db.collection('duet_solutions').insertOne(solution);

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
    const firstPlayer= _.sample(['yellow', 'green']);
    const green= wordList.slice(0,15);
    const yellow= wordList.slice(15,24);
    const black= [wordList[24]];
    console.log(black);
    const shuffledWords = _.shuffle(wordList)

    let solution = {
        code: code, 
        words: wordList, // dont pass the shuffled words
        firstPlayer: firstPlayer,
        Green: green,
        Yellow: yellow,
        Black: black,
        clicked: ['test']
    };
    
    // gather the children solutions
    const player1Solution = generateChild1(solution);
    const player2Solution = generateChild2(solution);

    solution = {
        code: code, 
        words: shuffledWords, // now pass the shuffled
        firstPlayer: firstPlayer,
        Green: green,
        Yellow: yellow,
        Black: black,
        player1Solution: player1Solution,
        player2Solution: player2Solution,
        clicked: []
    };

    console.log(solution)

    // append them as objects to the parent solution.
    const response = await db.collection('duet_solutions').insertOne(solution);
    
    if (response.acknowledged) {
        // Send a response with the code and other data
        res.status(201).json({
            code: code,
            message: "Solution created successfully",
            documentId: response.insertedId // You might also want the MongoDB document ID
        });

        // After adding a new one, delete the first
        await db.collection('duet_solutions').findOneAndDelete({});
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
    // response = await db.collection('duet_solutions').updateOne({ code: code }, { $push: { clicked: clickedString } });
    try {
      const gameCollection = db.collection('duet_solutions');
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
    const response = await db.collection('duet_solutions').findOneAndDelete({});
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