"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_model_1 = __importDefault(require("../models/game.model"));
const user_model_1 = __importStar(require("../models/user.model"));
const word_model_1 = __importDefault(require("../models/word.model"));
const apollo_server_1 = require("apollo-server");
const mongoose_1 = __importDefault(require("mongoose"));
const node_random_name_1 = __importDefault(require("node-random-name"));
const app_1 = require("../app");
const constants_1 = require("../constants");
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);
}
async function startGame() {
    const words = await word_model_1.default
        .aggregate([{ $sample: { size: 25 } }])
        .exec();
    const starts = Math.floor(Math.random() * 11) >= 5 ? user_model_1.Team.red : user_model_1.Team.green;
    const redWords = 
    // @ts-ignore
    words.splice(0, starts === user_model_1.Team.red ? 9 : 8).map(word => {
        return {
            ...word,
            team: user_model_1.Team.red,
            picked: false,
            death: false,
        };
    });
    const greenWords = words
        // @ts-ignore
        .splice(0, starts === user_model_1.Team.green ? 9 : 8)
        // @ts-ignore
        .map(word => {
        return {
            ...word,
            team: user_model_1.Team.green,
            picked: false,
            death: false,
        };
    });
    const deathWord = words.splice(0, 1).map(word => {
        return {
            ...word,
            team: user_model_1.Team.none,
            picked: false,
            death: true,
        };
    });
    const restWords = words.map(word => {
        return {
            ...word,
            team: user_model_1.Team.none,
            picked: false,
            death: false,
        };
    });
    return game_model_1.default.create({
        currentTurn: starts === user_model_1.Team.red ? user_model_1.Team.red : user_model_1.Team.green,
        words: shuffle([
            ...redWords,
            ...greenWords,
            ...deathWord,
            ...restWords,
        ]),
    }).catch(error => {
        throw error;
    });
}
exports.startGame = startGame;
async function joinGame({ permalink, team, role, name }) {
    const game = await game_model_1.default.findOne({ permalink })
        .populate('users')
        .exec();
    if (!game) {
        throw new apollo_server_1.ApolloError('That game does not exist.');
    }
    if (game.users.length === 4) {
        throw new apollo_server_1.ApolloError('That game is already full. Try starting a new one!');
    }
    const existingTeamRole = await user_model_1.default.findOne({
        game: game._id,
        role,
        team,
    }).exec();
    if (existingTeamRole) {
        throw new apollo_server_1.ApolloError(`A user with the role ${role} on the ${team} has already joined. Try changing your role or team!`);
    }
    const user = await user_model_1.default.create({
        name: name || node_random_name_1.default(),
        team,
        role,
        game: game._id,
    }).catch(error => {
        throw error;
    });
    await game.update({ $push: { users: [user._id] } }).exec();
    const updatedGame = await game_model_1.default.findById(game._id).exec();
    app_1.pubsub.publish(constants_1.GAME_UPDATED, {
        GameUpdated: updatedGame,
    });
    return user;
}
exports.joinGame = joinGame;
async function pickWord({ word, user, permalink }) {
    const game = await game_model_1.default.findOne({ permalink }).catch(error => {
        throw error;
    });
    const player = await user_model_1.default.findById(user)
        .lean()
        .exec();
    console.log({ player });
    if (game.currentTurn !== player.team) {
        return game;
    }
    const selectedWord = game.words.find(item => String(item._id) === String(word));
    if (!selectedWord) {
        throw new apollo_server_1.ApolloError('That word does not exist in this game.');
    }
    // The user picked the death word
    if (selectedWord.death) {
        await game.update({
            finished: true,
            winner: player.team === user_model_1.Team.green ? user_model_1.Team.red : user_model_1.Team.green,
        });
        app_1.pubsub.publish(constants_1.GAME_UPDATED, {
            GameUpdated: {
                ...game,
                finished: true,
                winner: player.team === user_model_1.Team.green ? user_model_1.Team.red : user_model_1.Team.green,
            },
        });
        return game_model_1.default.findById(game._id)
            .lean()
            .exec();
    }
    // Set the word as picked
    await game_model_1.default.findOneAndUpdate({ _id: game._id, 'words._id': new mongoose_1.default.Types.ObjectId(word) }, { $set: { 'words.$.picked': true } }).exec();
    const unselectedWords = await game_model_1.default.findById(game._id)
        .select('words')
        .then(data => {
        if (!data)
            return null;
        return data.words.filter(item => {
            return String(item.team) === String(player.team) && !item.picked;
        });
    })
        .catch(error => {
        throw error;
    });
    // The player has won if there are no more cards
    if (Array.isArray(unselectedWords) && !unselectedWords.length) {
        await game.update({
            winner: player.team,
            finished: true,
        });
    }
    // If player selected the other team's card - switch turns
    if (player.team !== selectedWord.team) {
        await game.update({
            currentTurn: player.team === user_model_1.Team.green ? user_model_1.Team.red : user_model_1.Team.green,
        });
    }
    const updatedGame = await game_model_1.default.findById(game._id)
        .lean()
        .exec();
    app_1.pubsub.publish(constants_1.GAME_UPDATED, {
        GameUpdated: updatedGame,
    });
    return updatedGame;
}
exports.pickWord = pickWord;
async function endTurn({ permalink }) {
    const currentGame = await game_model_1.default.findOne({ permalink }).exec();
    if (!currentGame) {
        throw new apollo_server_1.ApolloError('That game does not exist. Try starting a new one!');
    }
    const game = await game_model_1.default.findByIdAndUpdate(currentGame._id, {
        currentTurn: currentGame.currentTurn === user_model_1.Team.red ? user_model_1.Team.green : user_model_1.Team.red,
    }, { new: true }).exec();
    app_1.pubsub.publish(constants_1.GAME_UPDATED, { GameUpdated: game });
    return game;
}
exports.endTurn = endTurn;
async function getGame({ permalink }) {
    return game_model_1.default.findOne({ permalink })
        .populate('users')
        .lean()
        .exec();
}
exports.getGame = getGame;
//# sourceMappingURL=game.controller.js.map