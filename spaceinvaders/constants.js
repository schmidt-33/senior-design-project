/**
 * Author: Nick Eby
 * Date: Sep.8.2021
 * File: constants.js
 * Description: This file handles all constants for the space invaders game
 */

'use strict';
const HERO_MOVEMENT = 20;
const MISSILE_SPEED = 10; // 30
const FRAME_SPEED = 33; // milliseconds // 100
const ALIEN_SPEED = MISSILE_SPEED / 2;

module.exports = {
	HERO_MOVEMENT,
	MISSILE_SPEED,
	FRAME_SPEED,
	ALIEN_SPEED,
};