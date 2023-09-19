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
      clicked: [],
    };

    console.log(solution);

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
    Black: black,
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
    Black: black,
  };

  console.log(player2);
  return player2;
}

generate1000();
