import Game, { IGame } from '../models/game.model'
import User, { Team, Role } from '../models/user.model'
import word, { Word, Language } from '../models/word.model'
import { ApolloError } from 'apollo-server'
import mongoose from 'mongoose'
import randomName from 'node-random-name'
import { pubsub } from '../app'
import { GAME_UPDATED, GAME_RESET } from '../constants'
import analytics, { IAction } from '../models/analytics.model'

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

    const starts = Math.floor(Math.random() * 11) >= 5 ? Team.red : Team.green

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

    const greenWords = words
        // @ts-ignore
        .splice(0, starts === Team.green ? 9 : 8)
        // @ts-ignore
        .map(word => {
            return {
                ...word,
                team: Team.green,
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

    return { restWords, deathWord, greenWords, redWords, starts }
}

export interface StartGameInput {
    language: Language
    ip: string
}

export async function startGame({ language, ip }: StartGameInput) {
    const {
        restWords,
        deathWord,
        greenWords,
        redWords,
        starts,
    } = await getGameWords({ language })

    return Game.create({
        language,
        ip,
        currentTurn: starts === Team.red ? Team.red : Team.green,
        words: shuffle([
            ...redWords,
            ...greenWords,
            ...deathWord,
            ...restWords,
        ]),
    }).catch(error => {
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
    const game = await Game.findOne({ permalink })
        .populate('users')
        .exec()

    if (!game) {
        throw new ApolloError('That game does not exist.')
    }
    if (game.users.length === 4) {
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
    }).catch(() => {
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
}

export async function pickWord({ word, user, permalink }: PickWordInput) {
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

    // The user picked the death word
    if (selectedWord.death) {
        await game.update({
            finished: true,
            winner: player.team === Team.green ? Team.red : Team.green,
        })

        const data = {
            ...game.toJSON(),
            finished: true,
            winner: player.team === Team.green ? Team.red : Team.green,
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
    }

    // If player selected the other team's card - switch turns
    if (player.team !== selectedWord.team) {
        await game.update({
            currentTurn: player.team === Team.green ? Team.red : Team.green,
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
                currentGame.currentTurn === Team.red ? Team.green : Team.red,
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
    const game = await Game.findOne({ permalink })
        .lean()
        .exec()

    const {
        restWords,
        deathWord,
        greenWords,
        redWords,
        starts,
    } = await getGameWords({ language: game.language })

    await User.deleteMany({ game: game._id }).exec()

    const updatedGame = await Game.findOneAndUpdate(
        { permalink },
        {
            $set: {
                finished: false,
                winner: null,
                users: [],
                currentTurn: starts === Team.red ? Team.red : Team.green,
                words: shuffle([
                    ...redWords,
                    ...greenWords,
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
