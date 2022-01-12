const eventPrefix = require('./constants').eventPrefix;

module.exports = {
    ONLINE_COUNT_EVENT: 'online-count',

    GET_WORD_LISTS: `${eventPrefix}-get-word-lists`,

    NEW_GAME_EVENT: `${eventPrefix}-new-game`,
    GAME_CREATED_EVENT: `${eventPrefix}-game-created`,
    JOIN_GAME_EVENT: `${eventPrefix}-join-game`,
    GAME_JOINED_EVENT: `${eventPrefix}-game-joined`,
    LEAVE_GAME_EVENT: `${eventPrefix}-leave-game`,
    GAME_LEFT_EVENT: `${eventPrefix}-game-left`,
    PLAYER_JOINED_EVENT: `${eventPrefix}-player-joined`,
    PLAYER_LEFT_EVENT: `${eventPrefix}-player-left`,
    PLAYERS_CHANGED_EVENT: `${eventPrefix}-players-changed`,

    START_GAME_EVENT: `${eventPrefix}-start-game`,
    GAME_STARTED_EVENT: `${eventPrefix}-game-started`,
    STOP_GAME_EVENT: `${eventPrefix}-stop-game`,
    GAME_STOPPED_EVENT: `${eventPrefix}-game-stopped`,
    RESTART_GAME_EVENT: `${eventPrefix}-restart-game`,
    GAME_STATUS_EVENT:  `${eventPrefix}-game-status-changed`,

    INITIALIZE_ROUND_EVENT: `${eventPrefix}-initialize-round`,
    GET_ROUND_WORDS_EVENT: `${eventPrefix}-get-round-words`,
    ROUND_INITIALIZED_EVENT: `${eventPrefix}-round-initialized`,
 
    START_ROUND_EVENT: `${eventPrefix}-start-round`,
    ROUND_STARTED_EVENT: `${eventPrefix}-round-started`,
    ROUND_ENDED_EVENT: `${eventPrefix}-round-ended`,

    SUBMIT_GUESS_EVENT: `${eventPrefix}-submit-guess`,
    GUESS_SUBMITTED_EVENT: `${eventPrefix}-guess-submitted`,

    CANVAS_UPDATED: `${eventPrefix}-canvas-updated`,

}