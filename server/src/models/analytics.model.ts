import mongoose, { Document } from 'mongoose'
import { User, Team } from './user.model'
import Game, { IGame } from './game.model'

export enum IAction {
    NEW_GAME = 'NEW_GAME',
    RESET_GAME = 'RESET_GAME',
    JOIN_GAME = 'JOIN_GAME',
    FINISH_GAME = 'FINISH_GAME',
}

export enum IWinMechanism {
    DEATH_CARD = 'DEATH_CARD',
    PICKED_ALL_WORDS = 'PICKED_ALL_WORDS',
}

export interface IAnalytics extends Document {
    game: IGame
    user: User
    action: IAction
    newGame({ ip: string }): void
}

const Schema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        game: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        action: { type: String, enum: Object.values(IAction) },
        ip: { type: String },
        winner: { type: String, enum: Object.values(Team) },
        winMechanism: { type: String, enum: Object.values(IWinMechanism) },
    },
    { timestamps: true }
)

Schema.statics.newGame = function({ ip }): void {
    this.create({
        action: IAction.NEW_GAME,
        ip,
    })
}

Schema.statics.joinGame = function({ ip, user, game }): void {
    this.create({
        action: IAction.JOIN_GAME,
        user,
        game,
        ip,
    })
}

Schema.statics.resetGame = async function({ ip, permalink }): Promise<void> {
    const game = await Game.findOne({ permalink })
        .select('_id')
        .lean()
        .exec()
    this.create({
        action: IAction.RESET_GAME,
        ip,
        game: game._id,
    })
}

Schema.statics.finishGame = function({
    ip,
    user,
    game,
    winner,
    winMechanism,
}): void {
    this.create({
        action: IAction.FINISH_GAME,
        winner,
        user,
        game,
        ip,
    })
}

export default mongoose.model<IAnalytics>('Analytics', Schema)
