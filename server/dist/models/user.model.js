"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/card/model.ts
const mongoose_1 = __importDefault(require("mongoose"));
var Team;
(function (Team) {
    Team["red"] = "red";
    Team["green"] = "green";
    Team["none"] = "none";
})(Team = exports.Team || (exports.Team = {}));
var Role;
(function (Role) {
    Role["spymaster"] = "spymaster";
    Role["player"] = "player";
})(Role = exports.Role || (exports.Role = {}));
const Schema = new mongoose_1.default.Schema({
    team: { type: String, enum: ['red', 'green'] },
    role: { type: String, enum: ['spymaster', 'player'] },
    game: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Game' },
    name: String,
}, 
// Adds createdAt and updatedAt to the model
{ timestamps: true });
exports.default = mongoose_1.default.model('User', Schema);
//# sourceMappingURL=user.model.js.map