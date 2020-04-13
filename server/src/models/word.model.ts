import mongoose, { Document } from 'mongoose'
import { Team } from './user.model'

export enum Language {
    English = 'English',
    Adult = 'Adult',
}

export interface Word extends Document {
    _id: string
    label: string
    language: Language
    team: Team
    death: boolean
}

const Schema = new mongoose.Schema(
    {
        label: { type: String, required: true, unique: true },
        language: { type: String, enum: ['English', 'Adult'] },
    },
    // Adds createdAt and updatedAt to the model
    { timestamps: true }
)

export default mongoose.model<Word>('Word', Schema)
