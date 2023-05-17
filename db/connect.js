require('dotenv').config();


const {MongoClient} = require('mongodb');


async function connectDatabase() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      console.log('Connected to database');
      return client.db('CodeNamesdb');
    } catch (error) {
      console.error('Error connecting to database', error);
    }
  }
  
  module.exports = {
    connectDatabase
  };