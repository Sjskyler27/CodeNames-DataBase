const fs = require('fs');
const jsonList = require('./json/words.json');
const _ = require('lodash');

async function generate1000() {
  const solutions = [];

  for (let i = 0; i < 1000; i++) {
    const getWords = _.shuffle(jsonList.wordList);

    const wordList = getWords.slice(0, 25);
    //const code = _.sampleSize('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4).join('');
    const code = i;
    const firstPlayer = _.sample(['yellow', 'green']);
    const green = wordList.slice(0, 15);
    const yellow = wordList.slice(15, 24);
    const black = [wordList[24]];
    console.log(black);
    const shuffledWords = _.shuffle(wordList);

    let solution = {
      code: code,
      words: wordList, // dont pass the shuffled words
      firstPlayer: firstPlayer,
      Green: green,
      Yellow: yellow,
      Black: black,
      clicked: ['test'],
    };

    solutions.push(solution);
  }

  const jsonString = JSON.stringify(solutions, null, 2);

  fs.appendFile('duetsolutions.json', jsonString, (err) => {
    if (err) {
      console.error('Error appending solutions to JSON file:', err);
    } else {
      console.log('Solutions appended to JSON file.');
    }
  });
}

generate1000();
