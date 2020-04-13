import { withFilter } from 'graphql-subscriptions'
import { get } from 'lodash'
import {
    startGame,
    joinGame,
    JoinGameInput,
    pickWord,
    PickWordInput,
    endTurn,
    EndTurnInput,
    getGame,
    GetGameInput,
} from './controllers/game.controller'
import {} from './constants'
import { pubsub } from './app'
import User from './models/user.model'
import { IGame } from './models/game.model'
import { GAME_UPDATED } from './constants'

const resolvers = {
    Subscription: {
        GameUpdated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([GAME_UPDATED]),
                (payload, variables) => {
                    const permalink = get(variables, 'input.permalink', null)
                    const payloadPermalink = get(
                        payload,
                        'GameUpdated.permalink',
                        null
                    )

                    return (
                        permalink &&
                        payloadPermalink &&
                        permalink === payloadPermalink
                    )
                }
            ),
        },
    },
    Query: {
        game: (_: null, { input }: { input: GetGameInput }) => {
            return getGame(input)
        },
        // cards: (_: null, { input }: { input: GetAllCardsInput }) =>
        //     getAllCards({ ...input }),
    },
    Mutation: {
        StartGame: () => {
            return startGame()
        },
        JoinGame: (_: null, { input }: { input: JoinGameInput }) => {
            return joinGame(input)
        },
        PickWord: (_: null, { input }: { input: PickWordInput }) => {
            return pickWord(input)
        },
        EndTurn: (_: null, { input }: { input: EndTurnInput }) => {
            console.log({ input })
            return endTurn(input)
        },
    },
    Game: {
        users: ({ users }: IGame) => {
            return User.find({ _id: { $in: users } })
                .lean()
                .exec()
        },
    },
}

export default resolvers
