import mongoose, { Document } from 'mongoose'
import { User } from './user.model'
import Game, { IGame } from './game.model'

export enum IAction {
    NEW_GAME = 'NEW_GAME',
    RESET_GAME = 'RESET_GAME',
    JOIN_GAME = 'JOIN_GAME',
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

export default mongoose.model<IAnalytics>('Analytics', Schema)
