import mongoose, { Document } from 'mongoose'
import { Team } from './user.model'

export enum Language {
    English = 'English',
    Adult = 'Adult',
    German = 'German',
    Spanish = 'Spanish',
    French = 'French',
    Italian = 'Italian',
}

export interface Word extends Document {
    _id: string
    label: string
    language: Language
    team: Team
    death: boolean
    picked: boolean
}

const Schema = new mongoose.Schema(
    {
        label: { type: String, required: true, unique: true },
        language: { type: String, enum: Object.values(Language) },
    },
    // Adds createdAt and updatedAt to the model
    { timestamps: true }
)

export default mongoose.model<Word>('Word', Schema)
