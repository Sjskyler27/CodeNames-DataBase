const fs = require('fs');
const jsonList = require('./json/words.json');
const _ = require('lodash'); 

async function generate100() {
  const solutions = [];

  for (let i = 0; i < 1000; i++) {
    const getWords = _.shuffle(jsonList.wordList);
    const wordList = getWords.slice(0, 25);
    const code = i;
    const firstPlayer = _.sample(['red', 'blue']);
    const player1 = wordList.slice(0, 9);
    const player2 = wordList.slice(9, 17);
    const yellow = wordList.slice(17, 24);
    const black = wordList.slice(24, 25);
    const shuffledWords = _.shuffle(wordList);

    const solution = {
      code: code,
      words: shuffledWords,
      firstPlayer: firstPlayer,
      Player1: player1,
      Player2: player2,
      Yellow: yellow,
      Black: black,
      clicked: ['test'],
    };

    solutions.push(solution);
  }

  const jsonString = JSON.stringify(solutions, null, 2);

  fs.appendFile('solutions.json', jsonString, (err) => {
    if (err) {
      console.error('Error appending solutions to JSON file:', err);
    } else {
      console.log('Solutions appended to JSON file.');
    }
  });
}

generate100();