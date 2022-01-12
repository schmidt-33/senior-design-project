const readdirSync = require('fs').readdirSync;

const wordLists = [];

readdirSync(__dirname).forEach(file => {
    if (file.includes('.json') && !file.includes('test')) {
        wordLists.push(require(`./${file}`));
    }
});

function getWordListNames() {
    return wordLists.map(x => x.name);
}

function getWordList(name) {
    return wordLists.find(x => x.name.toLowerCase() === name.toLowerCase());
}

function getRandomWordFromWordList(name) {
    const wordList = getWordList(name);
    return wordList
        ? popRandomArrayElement(wordList.words)
        : "";
}

function popRandomArrayElement(array) {
	return array.splice(Math.floor(Math.random() * array.length), 1)[0];
}

module.exports = {
    wordLists,
    getWordListNames,
    getWordList,
    getRandomWordFromWordList
};