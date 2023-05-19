const _ = require('lodash');

const database = require('../db/connect');

const getAll = async (req, res)=>{
    const db = await database.connectDatabase();
    const result = await db.collection('solutions').find().toArray();
    console.log(result);
    res.send(result);
};
const getByCode = async (req, res)=>{
    const db = await database.connectDatabase();
    const code = req.params.code;
    const result = await db.collection('solutions').findOne({"code": code});
    console.log(result);
    res.send(result);
};
const basicCreate = async (req, res)=>{
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
        Black: black
      };
    
    const response = await db.collection('solutions').insertOne(solution);
    
    if (response.acknowledged) {
        res.status(201).json(response);
        // after adding a new one delete the first
        await db.collection('solutions').findOneAndDelete({});
    } else {
        res.status(500).json(response.error || 'could not create the solution.');
    }

    
}

// This function deletes the first document in the collection
// It doesn't need to handle HTTP requests or responses, so it doesn't take req or res as arguments
// const deleteFirstDocument = async () => {
//     const db = await database.connectDatabase();
//     await db.collection('solutions').findOneAndDelete({});
    
// };

const deleteFirst = async (req, res) => {
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
    basicCreate,
    createFromWords,
    deleteFirst
};