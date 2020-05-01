import Game, { IGame } from '../models/game.model'
import User, { Team, Role } from '../models/user.model'
import word, { Word, Language } from '../models/word.model'
import { ApolloError } from 'apollo-server'
import mongoose from 'mongoose'
import randomName from 'node-random-name'
import { pubsub } from '../app'
import { GAME_UPDATED, GAME_RESET } from '../constants'
import analytics, { IAction, IWinMechanism } from '../models/analytics.model'
import Logger from '../logger'

function shuffle(array: any) {
    return array.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5)
}

export async function getGameWords({ language }) {
    const words: Word[] = await word
        .aggregate([
            {
                $match: {
                    language,
                },
            },

            { $sample: { size: 25 } },
        ])
        .exec()

    const starts = Math.floor(Math.random() * 11) >= 5 ? Team.red : Team.blue

    const redWords =
        // @ts-ignore
        words.splice(0, starts === Team.red ? 9 : 8).map(word => {
            return {
                ...word,
                team: Team.red,
                picked: false,
                death: false,
            }
        })

    const blueWords = words
        // @ts-ignore
        .splice(0, starts === Team.blue ? 9 : 8)
        // @ts-ignore
        .map(word => {
            return {
                ...word,
                team: Team.blue,
                picked: false,
                death: false,
            }
        })

    const deathWord = words.splice(0, 1).map(word => {
        return {
            ...word,
            team: Team.none,
            picked: false,
            death: true,
        }
    })

    const restWords = words.map(word => {
        return {
            ...word,
            team: Team.none,
            picked: false,
            death: false,
        }
    })

    return { restWords, deathWord, blueWords, redWords, starts }
}

export interface StartGameInput {
    language: Language
    ip: string
}

export async function startGame({ language, ip }: StartGameInput) {
    Logger.info(`Starting new ${language} game from ip ${ip}`)

    const {
        restWords,
        deathWord,
        blueWords,
        redWords,
        starts,
    } = await getGameWords({ language })

    return Game.create({
        language,
        ip,
        currentTurn: starts === Team.red ? Team.red : Team.blue,
        words: shuffle([...redWords, ...blueWords, ...deathWord, ...restWords]),
    }).catch(error => {
        Logger.error(`Error starting new game: ${error.message}`)
        throw error
    })
}

export interface JoinGameInput {
    permalink: string
    team: Team
    role: Role
    name?: string
    ip: string
}

export async function joinGame({
    permalink,
    team,
    role,
    name,
    ip,
}: JoinGameInput) {
    Logger.info(
        `Joining game ${permalink} from ip ${ip} as role ${role} for ${team} team`
    )

    const game = await Game.findOne({ permalink })
        .populate('users')
        .exec()

    if (!game) {
        Logger.error(`Error joining game ${permalink}: Game does not exist`)
        throw new ApolloError('That game does not exist.')
    }
    if (game.users.length === 4) {
        Logger.error(
            `Error joining game ${permalink}: game users length is ${
                game.users.length
            }`
        )
        throw new ApolloError(
            'That game is already full. Try starting a new one!'
        )
    }

    const existingTeamRole = await User.findOne({
        game: game._id,
        role,
        team,
    }).exec()

    if (existingTeamRole) {
        throw new Error(
            `Sorry the ${String(role).toUpperCase()} role in the ${String(
                team
            ).toUpperCase()} team has been taken. Try choosing a different role or team.`
        )
    }

    const user = await User.create({
        name: name || randomName(),
        team,
        role,
        game: game._id,
        ip,
    }).catch(error => {
        Logger.error(`Error joining game ${permalink}: ${error.message}`)

        // Force the unique index
        throw new Error(
            `Sorry the ${String(role).toUpperCase()} role in the ${String(
                team
            ).toUpperCase()} team has been taken. Try choosing a different role or team.`
        )
    })

    // @ts-ignore
    analytics.joinGame({
        ip,
        game: game._id,
        user: user._id,
    })

    await game.update({ $push: { users: [user._id] } }).exec()

    const updatedGame = await Game.findById(game._id).exec()

    pubsub.publish(GAME_UPDATED, {
        GameUpdated: updatedGame,
    })

    return user
}

export interface PickWordInput {
    word: string
    user: string
    permalink: IGame['permalink']
    ip: string
}

export async function pickWord({ word, user, permalink, ip }: PickWordInput) {
    Logger.info(`Picking word ${word} in game ${permalink} from ip ${ip}`)
    const game: IGame = await Game.findOne({ permalink }).catch(error => {
        throw error
    })

    const player = await User.findById(user)
        .lean()
        .exec()

    if (game.currentTurn !== player.team) {
        return game
    }

    const selectedWord = game.words.find(
        item => String(item._id) === String(word)
    )

    if (!selectedWord) {
        throw new ApolloError('That word does not exist in this game.')
    }

    // Set the word as picked
    await Game.update(
        { _id: game._id, 'words._id': new mongoose.Types.ObjectId(word) },
        { $set: { 'words.$.picked': true } }
    ).exec()

    // The user picked the death word
    if (selectedWord.death) {
        const winner = player.team === Team.blue ? Team.red : Team.blue
        await game.update({
            finished: true,
            winner,
        })

        // @ts-ignore
        analytics.finishGame({
            ip,
            game: game._id,
            user: player._id,
            winner,
            winMechanism: IWinMechanism.DEATH_CARD,
        })

        const data = {
            ...game.toJSON(),
            finished: true,
            winner,
        }

        pubsub.publish(GAME_UPDATED, {
            GameUpdated: data,
        })

        return Game.findById(game._id)
            .lean()
            .exec()
    }

    // Set the word as picked
    await Game.update(
        { _id: game._id, 'words._id': new mongoose.Types.ObjectId(word) },
        { $set: { 'words.$.picked': true } }
    ).exec()

    const unselectedWords = await Game.findById(game._id)
        .select('words')
        .lean()
        .then(data => {
            if (!data) return null
            return data.words.filter(item => {
                return String(item.team) === String(player.team) && !item.picked
            })
        })
        .catch(error => {
            throw error
        })

    // The player has won if there are no more cards
    if (Array.isArray(unselectedWords) && !unselectedWords.length) {
        await game.update({
            winner: player.team,
            finished: true,
        })

        // @ts-ignore
        analytics.finishGame({
            ip,
            game: game._id,
            user: player._id,
            winner: player.team,
            winMechanism: IWinMechanism.PICKED_ALL_WORDS,
        })
    }

    // If player selected the other team's card - switch turns
    if (player.team !== selectedWord.team) {
        await game.update({
            currentTurn: player.team === Team.blue ? Team.red : Team.blue,
        })
    }

    const updatedGame = await Game.findById(game._id)
        .lean()
        .exec()

    pubsub.publish(GAME_UPDATED, {
        GameUpdated: updatedGame,
    })

    return updatedGame
}

export interface EndTurnInput {
    permalink: string
}
export async function endTurn({ permalink }: EndTurnInput) {
    Logger.info(`Ending turn in game ${permalink}`)
    const currentGame = await Game.findOne({ permalink }).exec()

    if (!currentGame) {
        throw new ApolloError(
            'That game does not exist. Try starting a new one!'
        )
    }

    const game = await Game.findByIdAndUpdate(
        currentGame._id,
        {
            currentTurn:
                currentGame.currentTurn === Team.red ? Team.blue : Team.red,
        },
        { new: true }
    ).exec()

    pubsub.publish(GAME_UPDATED, { GameUpdated: game })

    return game
}

export interface GetGameInput {
    permalink: string
}

export async function getGame({ permalink }: GetGameInput) {
    return Game.findOne({ permalink })
        .populate('users')
        .lean()
        .exec()
}

export interface ResetGameInput {
    permalink: string
}

export async function resetGame({ permalink }: ResetGameInput) {
    Logger.info(`Resetting game ${permalink}`)
    const game = await Game.findOne({ permalink })
        .lean()
        .exec()

    const {
        restWords,
        deathWord,
        blueWords,
        redWords,
        starts,
    } = await getGameWords({ language: game.language })

    await User.deleteMany({ game: game._id }).exec()

    const updatedGame = await Game.findOneAndUpdate(
        { permalink },
        {
            $set: {
                finished: false,
                winner: Team.none,
                users: [],
                currentTurn: starts === Team.red ? Team.red : Team.blue,
                words: shuffle([
                    ...redWords,
                    ...blueWords,
                    ...deathWord,
                    ...restWords,
                ]),
            },
        },
        { new: true }
    ).exec()

    pubsub.publish(GAME_UPDATED, { GameUpdated: updatedGame })

    pubsub.publish(GAME_RESET, { GameUpdated: updatedGame })
    return updatedGame
}
