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
module.exports = {
    getAll,
    getByCode,
    basicCreate

};