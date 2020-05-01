// src/models/card/model.ts
import mongoose, { Document } from 'mongoose'

export enum Team {
    red = 'red',
    blue = 'blue',
    none = 'none',
}

export enum Role {
    spymaster = 'spymaster',
    player = 'player',
}

export interface User extends Document {
    team: Team
    role: Role
    name: string
    ip: string
}

const Schema = new mongoose.Schema(
    {
        team: { type: String, enum: ['red', 'blue'] },
        role: { type: String, enum: ['spymaster', 'player'] },
        game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
        name: String,
        ip: String,
    },
    // Adds createdAt and updatedAt to the model
    { timestamps: true }
)

Schema.index({ team: 1, role: 1, game: 1 }, { unique: true })

export default mongoose.model<User>('User', Schema)
