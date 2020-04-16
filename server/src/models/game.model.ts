import mongoose, { Document } from 'mongoose'
import shortid from 'shortid'
import { User, Team } from './user.model'
import { Word, Language } from './word.model'

export interface IGame extends Document {
    title: string
    permalink: string
    finished: boolean
    language: Language
    winner: Team
    currentTurn: Team
    words: Word[]
    users: User[]
}

const Schema = new mongoose.Schema(
    {
        title: String,
        currentTurn: { type: String, enum: ['red', 'green'] },
        language: {
            type: String,
            default: 'English',
            enum: ['English', 'Adult'],
        },
        winner: {
            type: String,
            enum: ['red', 'green', 'none'],
            default: 'none',
        },
        words: [
            {
                label: String,
                team: { type: String, enum: ['red', 'green', 'none'] },
                picked: { type: Boolean, default: false },
                death: { type: Boolean, default: false },
            },
        ],
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        finished: { type: Boolean, default: false },
        permalink: { type: String, default: shortid.generate },
    },
    { timestamps: true }
)

export default mongoose.model<IGame>('Game', Schema)
