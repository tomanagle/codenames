"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const shortid_1 = __importDefault(require("shortid"));
const Schema = new mongoose_1.default.Schema({
    title: String,
    currentTurn: { type: String, enum: ['red', 'green'] },
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
    users: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    finished: { type: Boolean, default: false },
    permalink: { type: String, default: shortid_1.default.generate },
}, 
// Adds createdAt and updatedAt to the model
{ timestamps: true });
exports.default = mongoose_1.default.model('Game', Schema);
//# sourceMappingURL=game.model.js.map