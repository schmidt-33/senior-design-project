/**
 * Author: Nick Eby
 * Date: Aug.21.2021
 * File: util.js
 * Description: This file holds utility functions for the tictactoe game
 */

 'use strict';
 module.exports = {
    initTictactoe
 };



function initTictactoe(playerTurn){
    // initialize game state 

    return {
        board: {
            0: '',
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
            6: '',
            7: '',
            8: '',
        },
        turn: playerTurn,
    }
}