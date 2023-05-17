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

module.exports = {
    getAll,
    getByCode

};