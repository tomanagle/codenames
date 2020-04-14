"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
const lodash_1 = require("lodash");
const game_controller_1 = require("./controllers/game.controller");
const app_1 = require("./app");
const user_model_1 = __importDefault(require("./models/user.model"));
const constants_1 = require("./constants");
const resolvers = {
    Subscription: {
        GameUpdated: {
            subscribe: graphql_subscriptions_1.withFilter(() => app_1.pubsub.asyncIterator([constants_1.GAME_UPDATED]), (payload, variables) => {
                const permalink = lodash_1.get(variables, 'input.permalink', null);
                const payloadPermalink = lodash_1.get(payload, 'GameUpdated.permalink', null);
                return (permalink &&
                    payloadPermalink &&
                    permalink === payloadPermalink);
            }),
        },
    },
    Query: {
        game: (_, { input }) => {
            return game_controller_1.getGame(input);
        },
    },
    Mutation: {
        StartGame: () => {
            return game_controller_1.startGame();
        },
        JoinGame: (_, { input }) => {
            return game_controller_1.joinGame(input);
        },
        PickWord: (_, { input }) => {
            return game_controller_1.pickWord(input);
        },
        EndTurn: (_, { input }) => {
            console.log({ input });
            return game_controller_1.endTurn(input);
        },
    },
    Game: {
        users: ({ users }) => {
            return user_model_1.default.find({ _id: { $in: users } })
                .lean()
                .exec();
        },
    },
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map