import mongoose, { Document } from 'mongoose'
import shortid from 'shortid'
import { User, Team } from './user.model'
import { Word, Language } from './word.model'

import analytics, { IAction } from './analytics.model'

export interface IGame extends Document {
    title: string
    permalink: string
    finished: boolean
    language: Language
    winner: Team
    currentTurn: Team
    words: Word[]
    users: User[]
    ip: string
}

const Schema = new mongoose.Schema(
    {
        title: String,
        currentTurn: { type: String, enum: ['red', 'blue'] },
        language: {
            type: String,
            default: 'English',
            enum: Object.values(Language),
        },
        winner: {
            type: String,
            enum: ['red', 'blue', 'none'],
            default: 'none',
        },
        words: [
            {
                label: String,
                team: { type: String, enum: ['red', 'blue', 'none'] },
                picked: { type: Boolean, default: false },
                death: { type: Boolean, default: false },
            },
        ],
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        finished: { type: Boolean, default: false },
        permalink: { type: String, default: shortid.generate },
        ip: String,
    },
    { timestamps: true }
)

Schema.post('save', ({ ip, _id }: IGame) => {
    // @ts-ignore
    analytics.newGame({ ip, game: _id, action: IAction.NEW_GAME })
})

export default mongoose.model<IGame>('Game', Schema)
