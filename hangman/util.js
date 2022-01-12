'use strict'

const { getRandomWordFromWordList } = require('../shared/wordlists');

module.exports ={
	initHangman
}

/**
 * Initialize the game state for a new game of hangman
 */
function initHangman({ wordListName, guesser }) {
	const secretWord = getRandomWordFromWordList(wordListName);
	return createGameState(wordListName, secretWord, guesser);
}

function createGameState(wordListName, secretWord, guesser){
	return {
		wordListName,
		secretWord,
		revealedWord : initializeRevealedWord(secretWord),
		wrongAttempts : 0,
		gameOver: false,
		guesser,
		guesses: new Array(26).fill(false),
		players: {}
	};
}

function initializeRevealedWord(secretWord = "") {
	let revealedWord = "";

    for (let i = 0; i < secretWord.length; i++) {
      if (secretWord[i] != " ") {
        revealedWord += "_";
      } else {
        revealedWord += " ";
      }
    }

	return revealedWord;
}