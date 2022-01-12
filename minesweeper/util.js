/**
 * Author: Nick Eby
 * Date: Oct.26.2021
 * File: util.js
 * Description: This file holds utility functions for the minesweeper game
 */

 'use strict';
 module.exports = {
    initMinesweeper,
 };


function initMinesweeper(){
    // initialize game state 
    return {
        board: {
            1: {'val': '', 'hidden': true}, 2: {'val': '', 'hidden': true}, 3: {'val': '', 'hidden': true}, 4: {'val': '', 'hidden': true}, 5: {'val': '', 'hidden': true}, 6: {'val': '', 'hidden': true}, 7: {'val': '', 'hidden': true}, 8: {'val': '', 'hidden': true},
            9: {'val': '', 'hidden': true}, 10: {'val': '', 'hidden': true}, 11: {'val': '', 'hidden': true}, 12: {'val': '', 'hidden': true}, 13: {'val': '', 'hidden': true}, 14: {'val': '', 'hidden': true}, 15: {'val': '', 'hidden': true}, 16: {'val': '', 'hidden': true},
            17: {'val': '', 'hidden': true}, 18: {'val': '', 'hidden': true}, 19: {'val': '', 'hidden': true}, 20: {'val': '', 'hidden': true}, 21: {'val': '', 'hidden': true}, 22: {'val': '', 'hidden': true}, 23: {'val': '', 'hidden': true}, 24: {'val': '', 'hidden': true},
            25: {'val': '', 'hidden': true}, 26: {'val': '', 'hidden': true}, 27: {'val': '', 'hidden': true}, 28: {'val': '', 'hidden': true}, 29: {'val': '', 'hidden': true}, 30: {'val': '', 'hidden': true}, 31: {'val': '', 'hidden': true}, 32: {'val': '', 'hidden': true},
            33: {'val': '', 'hidden': true}, 34: {'val': '', 'hidden': true}, 35: {'val': '', 'hidden': true}, 36: {'val': '', 'hidden': true}, 37: {'val': '', 'hidden': true}, 38: {'val': '', 'hidden': true}, 39: {'val': '', 'hidden': true}, 40: {'val': '', 'hidden': true},
            41: {'val': '', 'hidden': true}, 42: {'val': '', 'hidden': true}, 43: {'val': '', 'hidden': true}, 44: {'val': '', 'hidden': true}, 45: {'val': '', 'hidden': true}, 46: {'val': '', 'hidden': true}, 47: {'val': '', 'hidden': true}, 48: {'val': '', 'hidden': true},
            49: {'val': '', 'hidden': true}, 50: {'val': '', 'hidden': true}, 51: {'val': '', 'hidden': true}, 52: {'val': '', 'hidden': true}, 53: {'val': '', 'hidden': true}, 54: {'val': '', 'hidden': true}, 55: {'val': '', 'hidden': true}, 56: {'val': '', 'hidden': true},
            57: {'val': '', 'hidden': true}, 58: {'val': '', 'hidden': true}, 59: {'val': '', 'hidden': true}, 60: {'val': '', 'hidden': true}, 61: {'val': '', 'hidden': true}, 62: {'val': '', 'hidden': true}, 63: {'val': '', 'hidden': true}, 64: {'val': '', 'hidden': true},
        },
        turn: true,
        time: 25, 
    }
}